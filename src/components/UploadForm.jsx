"use client"

import { useState, useRef } from "react"
import axios from "axios"

const UploadForm = ({ onResult }) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const MAX_FILE_SIZE_MB = 5

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    validateAndSetFile(selected)
  }

  const validateAndSetFile = (selected) => {
    const isPdf = selected.type === "application/pdf"
    const isSizeOk = selected.size <= MAX_FILE_SIZE_MB * 1024 * 1024

    if (!isPdf) {
      setErrorMsg("File harus berformat PDF.")
      clearFile()
    } else if (!isSizeOk) {
      setErrorMsg(`Ukuran file maksimal ${MAX_FILE_SIZE_MB}MB.`)
      clearFile()
    } else {
      setFile(selected)
      setErrorMsg("")
      setSuccessMsg("")
    }
  }

  const clearFile = () => {
    setFile(null)
    setSuccessMsg("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await axios.post("http://localhost:8000/cv/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })

      const data = res.data
      if (!data) {
        setErrorMsg("Respons dari server kosong.")
        return
      }

      onResult(data)
      if (data.saved) {
        window.dispatchEvent(new Event("cvUploaded"))
      }

      setSuccessMsg("CV berhasil diupload!")
      clearFile()
    } catch (err) {
      console.error("Upload error:", err)
      if (err.response?.data?.detail) {
        setErrorMsg(`Gagal: ${err.response.data.detail}`)
      } else {
        setErrorMsg("Upload gagal. Silakan coba lagi.")
      }
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload CV</h3>
          <p className="text-sm text-gray-600">Upload file CV dalam format PDF (maksimal {MAX_FILE_SIZE_MB}MB)</p>
        </div>

        {/* Drag & Drop Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
            dragActive
              ? "border-blue-400 bg-blue-50"
              : file
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {!file ? (
            <div className="space-y-2">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">Klik untuk upload</span>
                <span> atau drag & drop file</span>
              </div>
              <p className="text-xs text-gray-500">PDF hingga {MAX_FILE_SIZE_MB}MB</p>
            </div>
          ) : (
            <div className="space-y-2">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button onClick={clearFile} className="text-red-600 hover:text-red-700 text-sm font-medium">
                Hapus file
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="ml-2 text-sm text-red-700">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMsg && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="ml-2 text-sm text-green-700">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-200 ${
              loading || !file
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Mengunggah...
              </>
            ) : (
              <>
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Upload CV
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadForm

"use client"

import { useEffect, useRef, useState } from "react"
import UploadForm from "./UploadForm"
import ChatBubble from "./ChatBubble"
import axios from "axios"

const MatchCVBoard = ({ uploadId, onUpload }) => {
  const [chatHistory, setChatHistory] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)
  const [localUploadId, setLocalUploadId] = useState(uploadId || null)
  const inputRef = useRef(null)

  const handleUploadResult = (data) => {
    onUpload(data.upload_id) // update ke parent
    setLocalUploadId(data.upload_id) // update lokal untuk trigger fetch
    setChatHistory([
      { role: "user", text: "Berikut CV saya. Mohon rekomendasi pekerjaan." },
      { role: "llm", text: data.raw_gemini_response },
    ])
  }    

  const handleNewChat = () => {
    setChatHistory([])
    setInputMessage("")
    setLocalUploadId(null) // reset lokal juga
    onUpload(null)         // reset ke parent
    inputRef.current?.focus()
  }  

  const handleSend = async () => {
    if (!inputMessage.trim() || loading) return

    const userMessage = inputMessage.trim()
    setChatHistory((prev) => [...prev, { role: "user", text: userMessage }])
    setInputMessage("")
    setLoading(true)

    try {
      const res = await axios.post("http://localhost:8000/cv/chat", { message: userMessage, upload_id: localUploadId }, { withCredentials: true })
      setChatHistory((prev) => [...prev, { role: "llm", text: res.data.response }])
    } catch (err) {
      console.error(err)
      setChatHistory((prev) => [...prev, { role: "llm", text: "Terjadi kesalahan saat menjawab. Coba lagi nanti." }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  useEffect(() => {
    const handleNewChat = () => {
      setChatHistory([])
      setInputMessage("")
      onUpload(null) // reset uploadId dari atas
      inputRef.current?.focus()
    }
  
    window.addEventListener("cvUploaded", handleNewChat)
    return () => window.removeEventListener("cvUploaded", handleNewChat)
  }, [])
 

  useEffect(() => {
    const fetchHistory = async () => {
      if (!localUploadId) return
      try {
        const res = await axios.get(`http://localhost:8000/cv/chat-history/${localUploadId}`, {
          withCredentials: true
        })
        const history = res.data.map((c) => ({
          role: c.role,
          text: c.message,
          createdAt: c.created_at,
        }))
        setChatHistory(history)
      } catch (err) {
        console.error("Gagal mengambil riwayat chat:", err)
      }
    }
  
    fetchHistory()
  }, [localUploadId])
  
  useEffect(() => {
    if (localUploadId) localStorage.setItem("lastUploadId", localUploadId)
  }, [localUploadId])  

  useEffect(() => {
    setLocalUploadId(uploadId)
  }, [uploadId])

  useEffect(() => {
    const lastId = localStorage.getItem("lastUploadId")
    if (lastId) {
      setLocalUploadId(lastId)
      onUpload(lastId)
    }
  }, [])

  useEffect(() => {
    if (chatHistory.length > 0 && !loading) {
      inputRef.current?.focus()
    }
  }, [chatHistory, loading])

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">CV Matcher Assistant</h2>
            <p className="text-sm text-gray-600 mt-1">Upload CV Anda dan dapatkan rekomendasi pekerjaan yang sesuai</p>
          </div>
          {chatHistory.length > 0 && (
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Obrolan Baru
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-white rounded-full p-6 shadow-lg mb-6">
                <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Selamat datang di CV Matcher!</h3>
              <p className="text-gray-600 max-w-md">
                Upload CV Anda untuk mendapatkan analisis dan rekomendasi pekerjaan yang sesuai dengan profil Anda.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {chatHistory.map((msg, idx) => (
                <ChatBubble key={idx} role={msg.role} text={msg.text} />
              ))}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-start max-w-[80%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 text-gray-700 mr-2 flex items-center justify-center text-xs font-medium">
                      AI
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">AI sedang mengetik...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          {chatHistory.length === 0 ? (
            <div className="max-w-2xl mx-auto">
              <UploadForm onResult={handleUploadResult} />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Follow-up input */}
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Tulis pertanyaan lanjutan... (Enter untuk kirim, Shift+Enter untuk baris baru)"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      rows="1"
                      style={{
                        minHeight: "48px",
                        maxHeight: "120px",
                        height: "auto",
                      }}
                      onInput={(e) => {
                        e.target.style.height = "auto"
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
                      }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={loading || !inputMessage.trim()}
                      className="absolute right-2 bottom-2 p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload new CV option */}
              <div className="border-t border-gray-100 pt-4">
                <details className="group">
                  <summary className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-800 transition-colors duration-200">
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-open:rotate-90"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Upload CV baru
                  </summary>
                  <div className="mt-3 pl-6">
                    <UploadForm onResult={handleUploadResult} />
                  </div>
                </details>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MatchCVBoard

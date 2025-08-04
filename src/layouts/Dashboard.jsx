"use client"

import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FiMenu,
  FiSearch,
  FiUser,
  FiLogOut,
  FiPlus,
  FiClock,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi"
import axios from "axios"
import { UserContext } from "../contexts/UserContext"

const Dashboard = ({ children }) => {
  const { user, setUser, history } = useContext(UserContext)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const navigate = useNavigate()

  // Check for mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false)
      }
    }
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const handleLogout = async () => {
    setLoading(true)
    try {
      await axios.post("http://localhost:8000/auth/logout", {}, { withCredentials: true })
      setUser(null)
      navigate("/")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    window.dispatchEvent(new Event("cvUploaded"))
    window.dispatchEvent(new CustomEvent("selectUpload", { detail: null }))
    // Close sidebar on mobile after action
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const handleSelectHistory = (item) => {
    window.dispatchEvent(new CustomEvent("selectUpload", { detail: item.id }))
    // Close sidebar on mobile after selection
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const showDeleteModal = (item, e) => {
    e.stopPropagation()
    setDeleteModal({ show: true, item })
  }

  const hideDeleteModal = () => {
    setDeleteModal({ show: false, item: null })
  }

  const handleDeleteHistory = async () => {
    if (!deleteModal.item) return

    setDeleteLoading(true)
    try {
      await axios.delete(`http://localhost:8000/cv/delete-upload/${deleteModal.item.id}`, {
        withCredentials: true,
      })

      // Show success notification
      showNotification("CV berhasil dihapus!", "success")

      // Refresh history by dispatching the cvUploaded event
      window.dispatchEvent(new Event("cvUploaded"))
      // If this was the currently selected item, clear the selection
      window.dispatchEvent(new CustomEvent("selectUpload", { detail: null }))

      hideDeleteModal()
    } catch (err) {
      console.error("Delete error:", err)
      showNotification("Gagal menghapus CV. Silakan coba lagi.", "error")
    } finally {
      setDeleteLoading(false)
    }
  }

  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const filteredHistory = history.filter((item) =>
    item.original_filename.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 1) return "Hari ini"
    if (diffDays === 2) return "Kemarin"
    if (diffDays <= 7) return `${diffDays} hari lalu`
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
  }

  // === Jika BELUM LOGIN ===
  if (!user) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Enhanced Navbar for non-logged users */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-4 md:px-6 py-4 shadow-sm">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-105">
                <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MatchCV
              </h1>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="px-3 md:px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Masuk
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 md:px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Daftar
              </button>
            </div>
          </div>
        </div>
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </div>
    )
  }

  // === Jika SUDAH LOGIN ===
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-500 scale-100 animate-in slide-in-from-bottom-4">
            {/* Modal Header */}
            <div className="relative p-6 pb-4">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-red-50 rounded-t-3xl opacity-60"></div>

              {/* Close Button */}
              <button
                onClick={hideDeleteModal}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-full transition-all duration-200 hover:scale-110 z-10"
                disabled={deleteLoading}
              >
                <FiX className="w-5 h-5" />
              </button>

              {/* Header Content */}
              <div className="relative z-10 text-center">
                {/* Warning Icon with Animation */}
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4 shadow-lg animate-pulse">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-inner">
                    <FiAlertTriangle className="w-6 h-6 text-white animate-bounce" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus CV</h3>
                <p className="text-gray-600 text-sm">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 pb-6">
              <div className="text-center mb-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Apakah Anda yakin ingin menghapus CV ini? Semua data dan riwayat chat yang terkait akan hilang secara
                  permanen.
                </p>

                {deleteModal.item && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 mb-6 border border-gray-200/50 shadow-inner">
                    <div className="flex items-center space-x-4">
                      {/* File Icon with Glow Effect */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-400 rounded-xl blur-md opacity-30 animate-pulse"></div>
                        <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                          <FiFileText className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 text-left">
                        <p
                          className="text-sm font-semibold text-gray-900 mb-1 truncate"
                          title={deleteModal.item.original_filename}
                        >
                          {deleteModal.item.original_filename}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{formatDate(deleteModal.item.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={hideDeleteModal}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                  disabled={deleteLoading}
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteHistory}
                  disabled={deleteLoading}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                  {deleteLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="relative z-10">Menghapus...</span>
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Hapus Sekarang</span>
                    </>
                  )}
                </button>
              </div>

              {/* Warning Footer */}
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-amber-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <p className="text-xs text-amber-800 font-medium">Data yang dihapus tidak dapat dikembalikan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-[110] transform transition-all duration-300">
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            <div className={`w-5 h-5 ${notification.type === "success" ? "text-green-100" : "text-red-100"}`}>
              {notification.type === "success" ? (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <FiAlertTriangle />
              )}
            </div>
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar with Better Responsive Layout */}
      <div
        className={`${isMobile ? "fixed" : "relative"} bg-white border-r border-gray-200 flex flex-col shadow-lg z-50 ${
          isMobile ? "h-full" : ""
        } transition-all duration-300 ease-in-out ${
          sidebarOpen ? (isMobile ? "w-72 translate-x-0" : "w-72") : isMobile ? "w-72 -translate-x-full" : "w-14"
        }`}
        style={{
          maxWidth: isMobile ? "85vw" : sidebarOpen ? "300px" : "56px",
          minWidth: sidebarOpen ? (isMobile ? "280px" : "288px") : "56px",
        }}
      >
        {/* Sidebar Header with Enhanced Logo Animation */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden min-h-[72px]">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-indigo-100/50 to-blue-100/50 opacity-0 transition-opacity duration-700 hover:opacity-100"></div>
          {/* Logo Section with Enhanced Animation */}
          <div className="flex items-center space-x-3 overflow-hidden relative z-10 min-w-0 flex-1">
            {/* Animated Logo Icon */}
            <div
              className={`bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 transition-all duration-300 ease-out hover:scale-110 hover:rotate-3 ${
                sidebarOpen ? "w-10 h-10" : "w-8 h-8"
              }`}
            >
              <svg
                className={`text-white transition-all duration-300 ease-out ${sidebarOpen ? "w-6 h-6" : "w-5 h-5"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            {/* Animated Text Logo */}
            <div
              className={`transition-all duration-300 ease-out overflow-hidden ${
                sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
              }`}
            >
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap">
                MatchCV
              </h1>
            </div>
          </div>
          {/* Enhanced Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 group flex-shrink-0 relative z-10 hover:scale-110 active:scale-95"
          >
            <div className="relative">
              {sidebarOpen ? (
                <FiChevronLeft className="w-4 h-4 transition-all duration-200 group-hover:scale-110 group-hover:-translate-x-0.5" />
              ) : (
                <FiChevronRight className="w-4 h-4 transition-all duration-200 group-hover:scale-110 group-hover:translate-x-0.5" />
              )}
            </div>
          </button>
        </div>

        {/* Enhanced New Chat Button */}
        <div className="p-3 border-b border-gray-200">
          <button
            onClick={handleNewChat}
            className={`w-full flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden ${
              sidebarOpen ? "justify-center space-x-2 px-3 py-2.5" : "justify-center px-2 py-2.5"
            }`}
            title={!sidebarOpen ? "Obrolan Baru" : ""}
          >
            {/* Animated Background Shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <FiPlus
              className={`transition-all duration-200 group-hover:rotate-90 flex-shrink-0 relative z-10 ${
                sidebarOpen ? "w-4 h-4" : "w-5 h-5"
              }`}
            />
            <span
              className={`font-medium transition-all duration-300 ease-out overflow-hidden whitespace-nowrap relative z-10 ${
                sidebarOpen ? "opacity-100 max-w-none" : "opacity-0 max-w-0"
              }`}
            >
              Obrolan Baru
            </span>
          </button>
        </div>

        {/* Enhanced Search Bar */}
        <div
          className={`transition-all duration-300 ease-out overflow-hidden ${
            sidebarOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-3 border-b border-gray-200">
            <div className="relative group">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors duration-200 group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Cari riwayat CV..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Enhanced History Section with Flexible Scrolling */}
        <div className="flex-1 overflow-hidden">
          {sidebarOpen ? (
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
              <div className="p-3">
                <div
                  className={`flex items-center space-x-2 mb-3 transition-all duration-300 delay-100 ${
                    sidebarOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                >
                  <FiClock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide truncate">
                    Riwayat Upload
                  </h3>
                </div>
                {filteredHistory.length === 0 ? (
                  <div
                    className={`text-center py-6 transition-all duration-300 delay-200 ${
                      sidebarOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    <FiFileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 px-2">
                      {searchQuery ? "Tidak ada hasil pencarian" : "Belum ada riwayat upload"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 pb-3">
                    {filteredHistory.map((item, index) => (
                      <div
                        key={item.id}
                        className={`group p-2.5 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-200 transform hover:scale-[1.01] hover:shadow-sm ${
                          sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                        }`}
                        style={{
                          transitionDelay: `${index * 30 + 150}ms`,
                        }}
                      >
                        <div className="flex items-start space-x-2.5 min-w-0">
                          <div
                            className="w-7 h-7 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105 group-hover:rotate-3"
                            onClick={() => handleSelectHistory(item)}
                          >
                            <FiFileText className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0" onClick={() => handleSelectHistory(item)}>
                            <p
                              className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-200 truncate"
                              title={item.original_filename}
                            >
                              {item.original_filename}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">{formatDate(item.created_at)}</p>
                          </div>
                          <button
                            onClick={(e) => showDeleteModal(item, e)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-200 flex-shrink-0 transform hover:scale-110"
                            title="Delete CV"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Enhanced History Section - Collapsed State with All Items */
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
              <div className="p-1 space-y-1 pb-3">
                {filteredHistory.map((item, index) => (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => handleSelectHistory(item)}
                      className={`w-full p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110 hover:shadow-md hover:z-10 relative group-hover:ring-2 group-hover:ring-blue-200/50 ${
                        !sidebarOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                      }`}
                      style={{
                        transitionDelay: `${index * 50}ms`,
                      }}
                      title={item.original_filename}
                    >
                      <FiFileText className="w-4 h-4 mx-auto transition-all duration-200 group-hover:text-blue-700" />
                    </button>
                    {/* Enhanced Hover Preview Card with Better Positioning */}
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-[60] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-x-2 group-hover:translate-x-0 delay-150 pointer-events-none group-hover:pointer-events-auto">
                      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-64 backdrop-blur-sm transform scale-95 group-hover:scale-100 transition-transform duration-200">
                        {/* Enhanced Arrow */}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
                          <div className="w-2 h-2 bg-white border-l border-b border-gray-200 transform rotate-45 shadow-sm"></div>
                        </div>
                        {/* Preview Content */}
                        <div className="space-y-2.5">
                          {/* File Icon and Name */}
                          <div className="flex items-start space-x-2.5">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                              <FiFileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 break-words line-clamp-2">
                                {item.original_filename}
                              </h4>
                              <p className="text-xs text-gray-500">{formatDate(item.created_at)}</p>
                            </div>
                          </div>
                          {/* File Details */}
                          <div className="border-t border-gray-100 pt-2.5">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500">Status:</span>
                                <div className="flex items-center mt-1">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                                  <span className="text-green-600 font-medium">Processed</span>
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500">Type:</span>
                                <p className="text-gray-700 font-medium mt-1">PDF Document</p>
                              </div>
                            </div>
                          </div>
                          {/* Enhanced Quick Action */}
                          <div className="border-t border-gray-100 pt-2.5">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSelectHistory(item)}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-medium py-2 px-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg relative overflow-hidden group"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                                <div className="flex items-center justify-center space-x-1.5 relative z-10">
                                  <FiFileText className="w-3 h-3" />
                                  <span>Open</span>
                                </div>
                              </button>
                              <button
                                onClick={(e) => showDeleteModal(item, e)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                                title="Delete CV"
                              >
                                <FiTrash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced User Section */}
        <div className="border-t border-gray-200 p-3">
          <div className={`flex items-center ${sidebarOpen ? "space-x-2.5" : "justify-center"}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg flex-shrink-0">
              <FiUser className="w-4 h-4 text-white" />
            </div>
            <div
              className={`flex-1 min-w-0 transition-all duration-300 ease-out overflow-hidden ${
                sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
              }`}
            >
              <p className="text-sm font-medium text-gray-900 truncate" title={user.username}>
                {user.username}
              </p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          {/* Enhanced Logout Button */}
          <div className="mt-2.5">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
              title={!sidebarOpen ? (loading ? "Keluar..." : "Keluar") : ""}
            >
              <FiLogOut className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:rotate-12" />
              <span
                className={`transition-all duration-300 ease-out overflow-hidden whitespace-nowrap ${
                  sidebarOpen ? "opacity-100 max-w-none" : "opacity-0 max-w-0"
                }`}
              >
                {loading ? "Keluar..." : "Keluar"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Top Navigation with Modern Design */}
        <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/60 px-4 md:px-6 py-3 shadow-lg relative overflow-hidden">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-indigo-50/20 to-purple-50/30 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button with Enhanced Design */}
              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 md:hidden hover:scale-110 active:scale-95 shadow-sm hover:shadow-md group"
                >
                  <FiMenu className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                </button>
              )}
              {/* Enhanced Logo Section */}
              <div className="flex items-center space-x-4 group">
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                  <div className="relative w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-110 hover:rotate-6 hover:shadow-xl">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-white transition-all duration-300 group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-700 group-hover:via-indigo-700 group-hover:to-purple-700">
                    MatchCV
                  </h1>
                  <p className="text-xs text-gray-500 font-medium hidden md:block">AI-Powered CV Assistant</p>
                </div>
              </div>
            </div>
            {/* Enhanced Right Section - Simplified */}
            <div className="flex items-center">
              {/* Enhanced User Profile Section */}
              <div className="flex items-center space-x-3 px-3 md:px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 hover:shadow-lg group cursor-pointer border border-gray-200/50 hover:border-blue-200/50">
                {/* Status Indicator */}
                <div className="relative">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-green-400 via-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                  {/* Online Status Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-ping opacity-30"></div>
                </div>
                {/* User Info */}
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                    {user.username}
                  </span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500 font-medium">Online</span>
                  </div>
                </div>
                {/* Dropdown Arrow */}
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-all duration-200 group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {/* Subtle Bottom Border Animation */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="h-full">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
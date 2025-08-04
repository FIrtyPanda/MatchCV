"use client"

import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import ReactMarkdown from "react-markdown"

const ChatBubble = ({ role, text, timestamp, isError }) => {
  const formatTime = (date) => {
    if (!date) return ""
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"} mb-6 group`}>
      <div className={`flex items-start max-w-[85%] ${role === "user" ? "flex-row-reverse" : "flex-row"}`}>
        {/* Enhanced Avatar */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-lg transition-all duration-300 group-hover:scale-110 ${
            role === "user"
              ? "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white ml-3 ring-2 ring-blue-200/50"
              : isError
                ? "bg-gradient-to-br from-red-400 via-red-500 to-red-600 text-white mr-3 ring-2 ring-red-200/50"
                : "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 text-white mr-3 ring-2 ring-gray-200/50"
          }`}
        >
          {role === "user" ? "U" : "AI"}
        </div>

        {/* Enhanced Message Container */}
        <div className="flex flex-col">
          {/* Enhanced Message Bubble */}
          <div
            className={`px-6 py-4 rounded-3xl shadow-lg transition-all duration-300 group-hover:shadow-xl transform group-hover:scale-[1.02] relative overflow-hidden ${
              role === "user"
                ? "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white rounded-br-lg border border-blue-400/30 shadow-blue-200/50"
                : isError
                  ? "bg-gradient-to-br from-red-50 via-red-100 to-red-50 border-2 border-red-300/60 text-red-800 rounded-bl-lg shadow-red-200/50"
                  : "bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-sm border border-gray-300/60 text-gray-800 rounded-bl-lg shadow-gray-200/50"
            }`}
          >
            {/* Subtle background pattern for non-user messages */}
            {role !== "user" && !isError && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-indigo-50/20 pointer-events-none" />
            )}

            {/* Content */}
            <div className="relative z-10">
              <div className="text-sm leading-relaxed">
                {role === "llm" ? (
                  <div
                    className={`prose prose-sm max-w-screen-sm ${
                      isError
                        ? "prose-headings:text-red-800 prose-p:text-red-700 prose-strong:text-red-800"
                        : "prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:my-1 prose-p:my-3"
                    }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      components={{
                        p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,

                        // Highlighted Headings with Blue Theme
                        h1: ({ node, ...props }) => (
                          <h1
                            className="mt-6 mb-4 text-2xl font-bold font-mono text-gray-900 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 px-3 py-2 rounded-md border border-blue-200/50 shadow-sm"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            className="mt-6 mb-3 text-xl font-bold font-mono text-gray-900 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 px-3 py-2 rounded-md border border-blue-200/50 shadow-sm"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className="mt-5 mb-2 text-lg font-semibold font-mono text-gray-900 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 px-3 py-2 rounded-md border border-blue-200/50 shadow-sm"
                            {...props}
                          />
                        ),
                        h4: ({ node, ...props }) => (
                          <h4
                            className="mt-4 mb-2 text-base font-semibold font-mono text-gray-900 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 px-3 py-2 rounded-md border border-blue-200/50 shadow-sm"
                            {...props}
                          />
                        ),

                        // Blue-themed List Items
                        ul: ({ node, ...props }) => <ul className="mb-4 space-y-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="mb-4 space-y-2" {...props} />,
                        li: ({ node, ...props }) => (
                          <li className="leading-relaxed px-3 py-2 rounded-md border border-blue-200/60 shadow-sm hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200">
                            <div className="flex items-start">
                              <span className="inline-flex items-center justify-center w-2 h-2 mr-3 mt-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex-shrink-0"></span>
                              <span className="flex-1 font-medium text-gray-800">{props.children}</span>
                            </div>
                          </li>
                        ),

                        // Regular bold text (no highlight)
                        strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,

                        em: ({ node, ...props }) => <em className="italic font-serif text-blue-700" {...props} />,

                        code: ({ node, inline, ...props }) =>
                          inline ? (
                            <code
                              className="px-2 py-1 text-sm bg-blue-50 text-blue-700 rounded font-mono border border-blue-200/50"
                              {...props}
                            />
                          ) : (
                            <pre className="p-4 text-sm bg-gray-900 text-blue-400 rounded-lg font-mono overflow-x-auto my-4 border border-blue-200/30">
                              <code {...props} />
                            </pre>
                          ),

                        blockquote: ({ node, ...props }) => (
                          <blockquote
                            className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50 italic text-blue-800 my-4 rounded-r-md"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {(text || "")
                        .replace(/<br\s*\/?>/gi, "\n\n")
                        .replace(/\r\n/g, "\n")
                        .replace(/\n{3,}/g, "\n\n")}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap font-medium">{text}</div>
                )}
              </div>
            </div>

            {/* Subtle shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </div>

          {/* Enhanced Timestamp */}
          {timestamp && (
            <div
              className={`text-xs text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 ${
                role === "user" ? "text-right" : "text-left"
              }`}
            >
              <span className="bg-gray-100/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200/60 shadow-sm">
                {formatTime(timestamp)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatBubble
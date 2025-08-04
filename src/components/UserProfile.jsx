import { FiUser } from "react-icons/fi"

const UserProfile = ({ username, showName = true }) => (
  <div className="flex items-center space-x-3">
    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105">
      <FiUser className="w-4 h-4 text-white" />
    </div>
    {showName && (
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-gray-900 truncate">{username}</p>
        <p className="text-xs text-gray-500">Online</p>
      </div>
    )}
  </div>
)

export default UserProfile
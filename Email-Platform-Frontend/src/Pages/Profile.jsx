import React, { useState } from 'react'
import { User, Camera, Trash2 } from 'lucide-react'

export default function Profile() {
  const [profileName, setProfileName] = useState('Profile_Name')
  const [username, setUsername] = useState('Username')

  return (
    <div className="flex-1 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-12">Profile</h1>

        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-6">
            <div className="w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              <User className="w-24 h-24 text-gray-500" />
            </div>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-[#1FD1F8] text-white rounded-md hover:bg-[#1FD1F8B2] transition-colors duration-300 flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Change Picture
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 flex items-center">
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Picture
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <ProfileField 
            label="Profile Name" 
            value={profileName}
            onChange={setProfileName}
            description="Once changed, you cannot change it for 60 days."
          />
          <ProfileField 
            label="Username" 
            value={username}
            onChange={setUsername}
            description="Once changed, you cannot change it for 60 days."
          />
        </div>
      </div>
    </div>
  )
}

const ProfileField = ({ label, value, onChange, description }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-lg font-medium">{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1FD1F8] w-1/2"
        />
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}
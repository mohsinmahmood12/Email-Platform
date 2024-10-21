import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoHomeOutline, IoMailOutline, IoSendOutline, IoDocumentTextOutline, IoSettingsOutline } from 'react-icons/io5';
import { FaRegUser } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const mainMenuItems = [
    { name: 'Home', icon: <IoHomeOutline className="text-xl" />, path: '/dashboard' },
    { name: 'Inbox', icon: <IoMailOutline className="text-xl" />, path: '/dashboard/inbox' },
    { name: 'Sent', icon: <IoSendOutline className="text-xl" />, path: '/dashboard/sent' },
    { name: 'Drafts', icon: <IoDocumentTextOutline className="text-xl" />, path: '/dashboard/drafts' },
    { name: 'Templates', icon: <IoDocumentTextOutline className="text-xl" />, path: '/dashboard/templates' },
  ];

  const bottomMenuItems = [
    { name: 'Setting', icon: <IoSettingsOutline className="text-xl" />, path: '/dashboard/setting' },
    { name: 'Profile', icon: <FaRegUser className="text-xl" />, path: '/dashboard/profile' },
  ];

  const renderMenuItem = (item) => (
    <Link
      key={item.name}
      to={item.path}
      className={`flex items-center px-6 py-3 text-sm transition-colors duration-200 ${
        location.pathname === item.path
          ? 'bg-[#1FD1F8] text-gray-900 font-medium'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <span className="mr-4">{item.icon}</span>
      {item.name}
    </Link>
  );

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Logo</h1>
      </div>
      <nav className="flex-1 mt-6 flex flex-col justify-between">
        <div>
          {mainMenuItems.map(renderMenuItem)}
        </div>
        <div className="mb-6">
          {bottomMenuItems.map(renderMenuItem)}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
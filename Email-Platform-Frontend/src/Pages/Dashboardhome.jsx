import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom'; 
import { IoIosSearch } from "react-icons/io";
import { IoMdMailOpen } from "react-icons/io";
import { IoDocumentText, IoDocumentTextOutline } from "react-icons/io5";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { getInboxEmails, markEmailAsRead, searchEmails } from '../services/emailService';

const Dashboardhome = () => {
  const { unread: unreadCount, templates: templateCount, drafts: draftCount } = useOutletContext();
  const [user, setUser] = useState({ first_name: "", last_name: "" });
  const [inboxEmails, setInboxEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/profile');
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchInboxEmails = async () => {
      try {
        const emails = await getInboxEmails();
        setInboxEmails(emails);
      } catch (error) {
        console.error("Error fetching inbox emails:", error);
      }
    };

    fetchUserData();
    fetchInboxEmails();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const results = await searchEmails(searchQuery);
      setInboxEmails(results);
    } catch (error) {
      console.error("Error searching emails:", error);
    }
  };

  const handleMarkAsRead = async (emailId) => {
    try {
      await markEmailAsRead(emailId);
      setInboxEmails(inboxEmails.map(email => 
        email.id === emailId ? { ...email, is_read: true } : email
      ));
    } catch (error) {
      console.error("Error marking email as read:", error);
    }
  };

  return (
    <div className="flex-1 bg-gray-900 text-white min-h-screen p-6">
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <form onSubmit={handleSearch} className='w-96 h-10 bg-gray-800 flex items-center gap-3 px-4 rounded-md'>
          <IoIosSearch className="text-gray-400 text-xl" />
          <input 
            type="text" 
            className='w-full bg-transparent text-sm placeholder-gray-400 focus:outline-none' 
            placeholder='Search by people, template, messages'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className='mb-8 bg-gray-800 p-6 rounded-md'>
        <div className='flex items-center gap-4'>
          <div className='w-16 h-16 rounded-full bg-[#1FD1F8] flex items-center justify-center text-gray-900 text-2xl font-bold'>
            {user.first_name[0]}{user.last_name[0]}
          </div>
          <div>
            <p className='text-lg text-gray-400'>Good Evening,</p>
            <h2 className='text-2xl font-bold'>{user.first_name} {user.last_name}</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { icon: <IoMdMailOpen className="text-3xl text-[#1FD1F8]" />, title: "Unread Mails", count: unreadCount },
          { icon: <IoDocumentText className="text-3xl text-[#1FD1F8]" />, title: "Templates", count: templateCount },
          { icon: <IoDocumentTextOutline className="text-3xl text-[#1FD1F8]" />, title: "Drafts", count: draftCount },
        ].map((item, index) => (
          <div key={index} className='bg-gray-800 p-6 rounded-md'>
            <div className='flex items-center gap-4 mb-4'>
              {item.icon}
              <h3 className='text-xl font-semibold'>{item.title}</h3>
            </div>
            <p className='text-3xl font-light text-gray-400'>{item.count}</p>
          </div>
        ))}
      </div>

      <h2 className='text-2xl font-bold mb-4'>Inbox</h2>

      <div className='bg-gray-800 rounded-md overflow-hidden'>
        <table className='w-full'>
          <thead>
            <tr className='text-left bg-gray-700'>
              <th className='py-3 px-4 font-semibold text-gray-400'>Date</th>
              <th className='py-3 px-4 font-semibold text-gray-400'>From</th>
              <th className='py-3 px-4 font-semibold text-gray-400'>Subject</th>
              <th className='py-3 px-4 font-semibold text-gray-400'>Attachment</th>
              <th className='py-3 px-4 font-semibold text-gray-400'>Action</th>
            </tr>
          </thead>
          <tbody>
            {inboxEmails.map((email) => (
              <tr key={email.id} className='border-t border-gray-700'>
                <td className='py-3 px-4'>{new Date(email.created_at).toLocaleDateString()}</td>
                <td className='py-3 px-4'>{email.from_email}</td>
                <td className='py-3 px-4'>{email.subject}</td>
                <td className='py-3 px-4'>{email.has_attachment ? 'Yes' : 'No'}</td>
                <td className='py-3 px-4'>
                  <button
                    className='text-[#1FD1F8] hover:text-[#3ae7ff] transition-colors duration-200'
                    onClick={() => handleMarkAsRead(email.id)}
                    aria-label="Mark as read"
                  >
                    <FaEye className='text-xl' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='fixed bottom-8 right-8'>
        <button 
          className='w-14 h-14 rounded-full bg-[#1FD1F8] flex justify-center items-center text-gray-900 shadow-lg hover:bg-[#3ae7ff] transition-colors duration-300'
          aria-label="Create new email"
          onClick={() => navigate('/compose')} 
        >
          <FaRegEdit className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Dashboardhome;
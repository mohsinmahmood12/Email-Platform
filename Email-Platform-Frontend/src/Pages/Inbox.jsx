import React, { useState, useEffect } from 'react'
import { IoIosSearch } from "react-icons/io";
import { FaArrowRotateLeft, FaArrowRotateRight, FaRegStar } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { getInboxEmails, markEmailAsRead, searchEmails } from '../services/emailService';

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const fetchedEmails = await getInboxEmails();
      setEmails(fetchedEmails);
      if (fetchedEmails.length > 0) {
        setSelectedEmail(fetchedEmails[0]);
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const results = await searchEmails(searchQuery);
      setEmails(results);
    } catch (error) {
      console.error("Error searching emails:", error);
    }
  };

  const handleEmailClick = async (email) => {
    setSelectedEmail(email);
    if (!email.is_read) {
      try {
        await markEmailAsRead(email.id);
        setEmails(emails.map(e => e.id === email.id ? {...e, is_read: true} : e));
      } catch (error) {
        console.error("Error marking email as read:", error);
      }
    }
  };

  const filteredEmails = emails.filter(email => {
    if (filter === 'archive') return email.is_archived;
    if (filter === 'unread') return !email.is_read;
    return true;
  });

  return (
    <div className="flex-1 bg-gray-900 text-white min-h-screen flex">
      <div className="w-1/3 border-r border-gray-700 p-6">
        <h2 className='text-2xl font-bold mb-6'>Inbox</h2>
        <form onSubmit={handleSearch} className='w-full h-10 bg-gray-800 flex items-center gap-3 px-4 rounded-md mb-6'>
          <IoIosSearch className="text-gray-400 text-xl" />
          <input 
            type="text" 
            className='w-full bg-transparent text-sm placeholder-gray-400 focus:outline-none' 
            placeholder='Search by people, messages' 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <div className="flex gap-6 mb-6">
          <button 
            className={`text-sm font-medium ${filter === 'all' ? 'text-[#1FD1F8]' : 'text-gray-400'} hover:text-[#1FD1F8] transition-colors`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`text-sm font-medium ${filter === 'archive' ? 'text-[#1FD1F8]' : 'text-gray-400'} hover:text-[#1FD1F8] transition-colors`}
            onClick={() => setFilter('archive')}
          >
            Archive
          </button>
          <button 
            className={`text-sm font-medium ${filter === 'unread' ? 'text-[#1FD1F8]' : 'text-gray-400'} hover:text-[#1FD1F8] transition-colors`}
            onClick={() => setFilter('unread')}
          >
            Unread
          </button>
        </div>
        <div className="space-y-4">
          {filteredEmails.map((email) => (
            <div key={email.id} className={`p-4 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors cursor-pointer ${!email.is_read ? 'font-bold' : ''}`} onClick={() => handleEmailClick(email)}>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='text-lg font-semibold'>{email.from_email}</h3>
                <span className='text-xs text-gray-500'>{new Date(email.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <p className='text-sm font-medium mb-1'>{email.subject}</p>
              <p className='text-sm text-gray-400 line-clamp-2'>{email.body}</p>
            </div>
          ))}
        </div>
      </div>
      {selectedEmail && (
        <div className='flex-1 p-6'>
          <div className="flex justify-between items-center mb-8">
            <div className='flex items-center gap-4'>
              <div className="w-10 h-10 rounded-full bg-[#1FD1F8] flex items-center justify-center text-gray-900 font-bold text-xl">
                {selectedEmail.from_email[0].toUpperCase()}
              </div>
              <div>
                <h3 className='text-lg font-semibold'>{selectedEmail.from_email}</h3>
                <p className='text-sm text-gray-400'>{selectedEmail.from_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className='text-sm text-gray-400'>{new Date(selectedEmail.created_at).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}</span>
              <button className="text-gray-400 hover:text-[#1FD1F8] transition-colors">
                <FaArrowRotateLeft />
              </button>
              <button className="text-gray-400 hover:text-[#1FD1F8] transition-colors">
                <FaArrowRotateRight />
              </button>
              <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                <FaRegStar />
              </button>
            </div>
          </div>

          <h2 className='text-2xl font-bold mb-6'>{selectedEmail.subject}</h2>
          <div className='space-y-4 text-gray-300'>
            <p>{selectedEmail.body}</p>
          </div>
        </div>
      )}
      <div className='fixed bottom-8 right-8'>
        <button className='w-14 h-14 rounded-full bg-[#1FD1F8] flex justify-center items-center text-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300'>
          <FaRegEdit className="text-xl" />
        </button>
      </div>
    </div>
  )
}

export default Inbox
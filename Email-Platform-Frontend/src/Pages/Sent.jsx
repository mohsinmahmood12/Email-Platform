import React, { useState, useEffect } from 'react'
import { IoIosSearch } from "react-icons/io";
import {FaRegStar, FaRegEdit } from "react-icons/fa";
import { getSentEmails, searchEmails } from '../services/emailService';

const Sent = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const fetchedEmails = await getSentEmails();
      setEmails(fetchedEmails);
      if (fetchedEmails.length > 0) {
        setSelectedEmail(fetchedEmails[0]);
      }
    } catch (error) {
      console.error("Error fetching sent emails:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const results = await searchEmails(searchQuery, 'sent');
      setEmails(results);
    } catch (error) {
      console.error("Error searching emails:", error);
    }
  };

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  const filteredEmails = emails.filter(email => {
    if (filter === 'archive') return email.is_archived;
    return true;
  });

  return (
    <div className="flex-1 bg-gray-900 text-white min-h-screen flex">
      <div className="w-1/3 border-r border-gray-700 p-6">
        <h2 className='text-2xl font-bold mb-6'>Sent</h2>
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
        <div className="space-y-4">
          {filteredEmails.map((email) => (
            <div key={email.id} className="p-4 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors cursor-pointer" onClick={() => handleEmailClick(email)}>
              <div className='flex justify-between items-start mb-2'>
                <div>
                  <h3 className='text-sm font-semibold'>To: {email.to_email}</h3>
                  <p className='text-xs text-gray-400'>{email.subject}</p>
                </div>
                <span className='text-xs text-gray-500'>{new Date(email.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <p className='text-xs text-gray-400 line-clamp-2'>{email.body}</p>
            </div>
          ))}
        </div>
      </div>
      {selectedEmail && (
        <div className='flex-1 p-6'>
          <div className="flex justify-between items-center mb-8">
            <div className='flex items-center gap-4'>
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xl">
                {selectedEmail.to_email[0].toUpperCase()}
              </div>
              <div>
                <h3 className='text-sm font-semibold'>From: Username</h3>
                <p className='text-xs text-gray-400'>To: {selectedEmail.to_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className='text-xs text-gray-400'>{new Date(selectedEmail.created_at).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}</span>
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

          <h2 className='text-xl font-bold mb-6'>{selectedEmail.subject}</h2>
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

export default Sent
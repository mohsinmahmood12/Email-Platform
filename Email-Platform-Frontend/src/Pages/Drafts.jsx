import React, { useState, useEffect } from 'react'
import { IoIosSearch } from "react-icons/io";
import { FaRegStar, FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { getDrafts, searchEmails, updateDraft } from '../services/emailService';

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const fetchedDrafts = await getDrafts();
      setDrafts(fetchedDrafts);
      if (fetchedDrafts.length > 0) {
        setSelectedDraft(fetchedDrafts[0]);
      }
    } catch (error) {
      console.error("Error fetching drafts:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const results = await searchEmails(searchQuery, 'drafts');
      setDrafts(results);
    } catch (error) {
      console.error("Error searching drafts:", error);
    }
  };

  const handleDraftClick = (draft) => {
    setSelectedDraft(draft);
  };

  const handleDraftEdit = async (updatedDraft) => {
    try {
      const updated = await updateDraft(updatedDraft.id, updatedDraft);
      setDrafts(drafts.map(draft => draft.id === updated.id ? updated : draft));
      setSelectedDraft(updated);
    } catch (error) {
      console.error("Error updating draft:", error);
    }
  };

  const filteredDrafts = drafts.filter(draft => {
    if (filter === 'archive') return draft.is_archived;
    return true;
  });

  return (
    <div className="flex-1 bg-gray-900 text-white min-h-screen flex">
      <div className="w-1/3 border-r border-gray-700 p-6">
        <h2 className='text-2xl font-bold mb-6'>Drafts</h2>
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
        </div>
        <div className="space-y-4">
          {filteredDrafts.map((draft) => (
            <div key={draft.id} className="p-4 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors cursor-pointer" onClick={() => handleDraftClick(draft)}>
              <div className='flex justify-between items-start mb-2'>
                <div>
                  <h3 className='text-sm font-semibold'>To: {draft.to_email}</h3>
                  <p className='text-xs text-gray-400'>{draft.subject}</p>
                </div>
                <span className='text-xs text-gray-500'>{new Date(draft.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <p className='text-xs text-gray-400 line-clamp-2'>{draft.body}</p>
            </div>
          ))}
        </div>
      </div>
      {selectedDraft && (
        <div className='flex-1 p-6'>
          <div className="flex justify-between items-center mb-8">
            <div className='flex items-center gap-4'>
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xl">
                {selectedDraft.to_email[0].toUpperCase()}
              </div>
              <div>
                <h3 className='text-sm font-semibold'>To: {selectedDraft.to_email}</h3>
                <p className='text-xs text-gray-400'>{selectedDraft.to_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className='text-xs text-gray-400'>{new Date(selectedDraft.updated_at).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}</span>
              <button className="text-gray-400 hover:text-[#1FD1F8] transition-colors" onClick={() => handleDraftEdit(selectedDraft)}>
                <FaRegEdit />
              </button>
              <button className="text-gray-400 hover:text-[#1FD1F8] transition-colors">
                <FaRegStar />
              </button>
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <FaTrashAlt />
              </button>
            </div>
          </div>

          <h2 className='text-xl font-bold mb-6'>{selectedDraft.subject}</h2>
          <div className='space-y-4 text-gray-300'>
            <p>{selectedDraft.body}</p>
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

export default Drafts
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import { getUnreadCount, getTemplatesCount, getDraftsCount } from '../services/emailService';

function Dashboard() {
  const [counts, setCounts] = useState({
    unread: 0,
    templates: 0,
    drafts: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [unreadCount, templatesCount, draftsCount] = await Promise.all([
          getUnreadCount(),
          getTemplatesCount(),
          getDraftsCount()
        ]);
        setCounts({
          unread: unreadCount,
          templates: templatesCount,
          drafts: draftsCount
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="dashboard flex min-h-screen">
      <Sidebar className='md:block hidden' />
      <div className="content flex-grow p-3">
        <Outlet context={counts} />
      </div>
    </div>
  );
}

export default Dashboard;
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const EmailModal = ({ isOpen, onClose, onSubmit, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
        <div className="flex items-center mb-4">
          <button onClick={onClose} className="mr-4">
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">Compose Email</h1>
        </div>
        <form onSubmit={onSubmit}>
          {children}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;

import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { sendEmail } from '../services/emailService';
import { FaArrowLeft, FaPaperclip } from 'react-icons/fa';

const ComposeEmail = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState(null);
  const navigate = useNavigate();

  const mutation = useMutation(sendEmail, {
    onSuccess: () => {
      navigate('/dashboard');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('to_email', to);
    formData.append('subject', subject);
    formData.append('body', body);
    if (attachment) {
      formData.append('attachment', attachment);
    }
    mutation.mutate(formData);
  };

  const handleAttachment = (e) => {
    const file = e.target.files[0];
    setAttachment(file);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4">
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Compose Email</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="to" className="block text-sm font-medium text-gray-700">
            To
          </label>
          <input
            type="email"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="body"
            rows="10"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
            Attachment
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              id="attachment"
              onChange={handleAttachment}
              className="sr-only"
            />
            <label
              htmlFor="attachment"
              className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPaperclip className="inline-block mr-2" />
              {attachment ? attachment.name : 'Attach file'}
            </label>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
      {mutation.isError && (
        <div className="mt-4 text-red-600">
          An error occurred: {mutation.error.message}
        </div>
      )}
    </div>
  );
};

export default ComposeEmail;
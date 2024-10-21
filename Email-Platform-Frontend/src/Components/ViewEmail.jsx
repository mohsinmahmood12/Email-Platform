import React from 'react';
import { useQuery } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEmail } from '../services/api';
import { FaArrowLeft, FaTrash, FaReply, FaForward } from 'react-icons/fa';

const ViewEmail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: email, isLoading, error } = useQuery(['email', id], () => fetchEmail(id));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4">
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">{email.subject}</h1>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="font-semibold">{email.from_email}</p>
            <p className="text-sm text-gray-500">
              {new Date(email.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FaTrash />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FaReply />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FaForward />
            </button>
          </div>
        </div>
        <div className="mt-6" dangerouslySetInnerHTML={{ __html: email.body }} />
        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Attachments</h2>
            <ul className="space-y-2">
              {email.attachments.map((attachment) => (
                <li key={attachment.id}>
                  <a
                    href={`/api/attachments/${attachment.id}`}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {attachment.filename}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEmail;
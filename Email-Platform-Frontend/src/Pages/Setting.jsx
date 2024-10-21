import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserEmail, updateUserPassword, cancelSubscription, useActivationCode, getWhiteLabel, updateWhiteLabel } from '../services/userService';
import { IoSettingsOutline } from "react-icons/io5";

export default function Setting() {
  const [user, setUser] = useState({ email: 'user@example.com' });
  const [whiteLabel, setWhiteLabel] = useState({ platform_name: 'Business Name' });
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [newPlatformName, setNewPlatformName] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchWhiteLabelData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchWhiteLabelData = async () => {
    try {
      const whiteLabelData = await getWhiteLabel();
      setWhiteLabel(whiteLabelData);
    } catch (error) {
      console.error("Error fetching white label data:", error);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      await updateUserEmail(newEmail);
      setUser({ ...user, email: newEmail });
      setNewEmail('');
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await updateUserPassword(newPassword);
      setNewPassword('');
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription();
      fetchUserData();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
    }
  };

  const handleUseActivationCode = async (e) => {
    e.preventDefault();
    try {
      await useActivationCode(activationCode);
      setActivationCode('');
      fetchUserData();
    } catch (error) {
      console.error("Error using activation code:", error);
    }
  };

  const handleUpdateWhiteLabel = async (e) => {
    e.preventDefault();
    try {
      const updatedWhiteLabel = await updateWhiteLabel({
        platform_name: newPlatformName,
      });
      setWhiteLabel(updatedWhiteLabel);
      setNewPlatformName('');
    } catch (error) {
      console.error("Error updating white label:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Account</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Email</h3>
                <p className="text-gray-400">{user.email}</p>
              </div>
              <button onClick={handleEmailChange} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
                Change Email
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Password</h3>
                <p className="text-gray-400">Once changed, you cannot change it for 60 days.</p>
              </div>
              <button onClick={handlePasswordChange} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
                Change Password
              </button>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Subscription</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Current Subscription</h3>
                <p className="text-gray-400">Monthly Subscription $3 (Auto renews on Aug 1,2024)</p>
              </div>
              <button onClick={handleCancelSubscription} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                Cancel Subscription
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Activation Code</h3>
                <p className="text-gray-400">If used now, will apply new month</p>
              </div>
              <button onClick={handleUseActivationCode} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
                Use Activation Code
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">White Label</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Platform Name</h3>
                <p className="text-gray-400">Once changed, you cannot change it for 60 days.</p>
              </div>
              <input
                type="text"
                value={newPlatformName}
                onChange={(e) => setNewPlatformName(e.target.value)}
                placeholder={whiteLabel.platform_name}
                className="px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Color Scheme</h3>
                <p className="text-gray-400">Lorem ipsum dolor sit amet</p>
              </div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Business Logo</h3>
                <p className="text-gray-400">Lorem ipsum dolor sit amet</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-400 hover:underline">Edit Logo</button>
                <div className="w-10 h-10 bg-white rounded-md"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import Nav from '../Components/Nav';
import { FaTiktok, FaCheck, FaSpinner } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Subscription = () => {
    const [activationCode, setActivationCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubscription = async (type) => {
        setError('');
        setIsLoading(true);
        try {
            const payload = type === 'free' 
                ? { subscription_type: 'free', activation_code: activationCode }
                : { subscription_type: 'paid' };

            const response = await axios.post('http://localhost:8000/api/v1/subscriptions/select', payload, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (type === 'free') {
                console.log('Free subscription activated:', response.data);
                navigate('/setupemail');
            } else {
                console.log('Paid subscription initiated:', response.data);
                window.location.href = response.data.checkout_url;
            }
        } catch (error) {
            console.error('Subscription error:', error.response?.data);
            setError(error.response?.data?.detail || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const benefits = [
        "Voice & Support Group",
        "Exclusive Content Access",
        "Priority Customer Support",
        "Ad-free Experience"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0F0F1E] to-[#1A1A2E] text-white">
            <Nav />
            <div className='w-full min-h-screen flex items-center justify-center px-4 py-12'>
                <div className='max-w-[800px] w-full py-8 px-6 rounded-[12px] bg-[#E6EAFF17] backdrop-blur-sm shadow-lg'>
                    <h2 className='text-3xl font-bold mb-2'>Select Subscription</h2>
                    <p className='text-lg font-normal text-[#A5A3CB] mb-6'>Choose a plan that works for you</p>
                    {error && <p className='text-red-500 mb-4 text-sm bg-red-100 border border-red-400 rounded-md p-3'>{error}</p>}
                    <div className='grid md:grid-cols-2 gap-8 mt-8'>
                        <div className='bg-[#1F2137] rounded-[12px] p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105'>
                            <p className='text-xl font-bold mb-2'>Activation Code</p>
                            <h3 className='text-4xl font-bold mb-4'>Free</h3>
                            <p className='text-lg font-bold mb-4'>Benefits</p>
                            {benefits.map((benefit, index) => (
                                <div key={index} className='flex items-center gap-2 mb-2'>
                                    <FaCheck className='text-[#1FD1F8]'/>
                                    <p className='text-sm text-[#A5A3CB]'>{benefit}</p>
                                </div>
                            ))}
                            <div className='mt-6'>
                                <input 
                                    type="text" 
                                    placeholder="Enter Activation Code" 
                                    value={activationCode}
                                    onChange={(e) => setActivationCode(e.target.value)}
                                    className='w-full p-2 mb-4 bg-transparent border border-[#1FD1F8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1FD1F8] transition duration-300'
                                />
                                <button 
                                    onClick={() => handleSubscription('free')}
                                    disabled={isLoading}
                                    className='w-full border-2 border-[#1FD1F8] rounded-lg py-2 text-[#1FD1F8] font-bold hover:bg-[#1FD1F8] hover:text-white transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Activate'}
                                </button>
                            </div>
                        </div>

                        <div className='bg-[#1F2137] rounded-[12px] p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105'>
                            <p className='text-xl font-bold mb-2'>Standard</p>
                            <h3 className='text-4xl font-bold mb-4'>$3<span className='text-lg font-normal'>/month</span></h3>
                            <p className='text-lg font-bold mb-4'>Benefits</p>
                            {benefits.map((benefit, index) => (
                                <div key={index} className='flex items-center gap-2 mb-2'>
                                    <FaCheck className='text-[#1FD1F8]'/>
                                    <p className='text-sm text-[#A5A3CB]'>{benefit}</p>
                                </div>
                            ))}
                            <div className='mt-6'>
                                <button 
                                    onClick={() => handleSubscription('paid')}
                                    disabled={isLoading}
                                    className='w-full bg-gradient-to-r from-[#1FD1F8] to-[#2FECD3] text-white rounded-lg py-3 font-bold hover:opacity-90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Subscribe'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
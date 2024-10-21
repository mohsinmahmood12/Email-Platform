import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import Nav from '../Components/Nav';

const ENTRI_APPLICATION_ID = 'sitesgpt';

const Setupemail = () => {
    const navigate = useNavigate();
    const [setupError, setSetupError] = useState('');
    const [isEntriLoading, setIsEntriLoading] = useState(false);

    const validationSchema = Yup.object({
        domain: Yup.string().required('Domain is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        setSetupError('');
        setIsEntriLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/v1/email-setup/setup', {
                domain_name: values.domain,
                email_address: values.email
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log('Email setup initiated:', response.data);

            const config = {
                applicationId: ENTRI_APPLICATION_ID,
                token: response.data.entri_config.token,
                dnsRecords: response.data.entri_config.dnsRecords,
            };

            if (window.entri && window.entri.showEntri) {
                window.entri.showEntri(config);
                window.addEventListener('onEntriClose', handleEntriClose, false);
            } else {
                throw new Error('Entri is not available');
            }
        } catch (error) {
            console.error('Error setting up email:', error);
            setSetupError(error.response?.data?.detail || 'An error occurred during email setup. Please try again.');
        } finally {
            setSubmitting(false);
            setIsEntriLoading(false);
        }
    };

    const handleEntriClose = async (event) => {
        console.log('Entri modal closed', event.detail);
        const result = event.detail;

        try {
            await axios.post('http://localhost:8000/api/v1/email-setup/entri-callback', result, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (result.success) {
                navigate('/success');
            } else {
                throw new Error('Email setup was not completed');
            }
        } catch (error) {
            console.error('Error processing email setup:', error);
            setSetupError('Email setup could not be completed. Please try again.');
        }

        window.removeEventListener('onEntriClose', handleEntriClose);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0F0F1E] to-[#1A1A2E] text-white">
            <Nav />
            <div className='w-full min-h-screen flex items-center justify-center px-4 py-12'>
                <div className='max-w-[440px] w-full py-8 px-6 rounded-[12px] bg-[#E6EAFF17] backdrop-blur-sm shadow-lg'>
                    <h2 className='text-3xl font-bold mb-2'>Setup your email</h2>
                    <p className='text-lg font-normal text-[#A5A3CB] mb-6'>Enter the information below to finalize your email address</p>
                    {setupError && <p className='text-red-500 mb-4 text-sm bg-red-100 border border-red-400 rounded-md p-3'>{setupError}</p>}
                    <Formik
                        initialValues={{ domain: '', email: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label htmlFor="domain" className='block mb-1 text-sm font-medium text-[#A5A3CB]'>Enter your domain name</label>
                                    <Field type="text" id="domain" name="domain" className='w-full bg-transparent border border-[#A5A3CB] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#1FD1F8] transition duration-300' placeholder='yourdomain.com' />
                                    <ErrorMessage name="domain" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="email" className='block mb-1 text-sm font-medium text-[#A5A3CB]'>Email</label>
                                    <Field type="email" id="email" name="email" className='w-full bg-transparent border border-[#A5A3CB] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#1FD1F8] transition duration-300' placeholder='your.email@example.com' />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className='flex gap-4 mt-6'>
                                    <button type="button" onClick={() => navigate(-1)} className='flex-1 flex items-center justify-center rounded-lg px-3 py-2 border border-[#1FD1F8] text-white hover:bg-[#1FD1F8] hover:bg-opacity-10 transition duration-300'>
                                        <FaArrowLeft className="mr-2" /> Go Back
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting || isEntriLoading} 
                                        className='flex-1 rounded-lg py-2 bg-gradient-to-r from-[#1FD1F8] to-[#2FECD3] text-white font-semibold hover:opacity-90 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {isSubmitting || isEntriLoading ? 'Setting up...' : 'Next'}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Setupemail;
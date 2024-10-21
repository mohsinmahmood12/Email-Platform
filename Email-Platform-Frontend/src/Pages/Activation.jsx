import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../Components/Nav';

const Activation = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const validationSchema = Yup.object({
        activation_code: Yup.string()
            .matches(/^[A-Za-z0-9-]{19}$/, 'Invalid activation code format')
            .required('Activation code is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post('http://35.172.141.151:8000/api/v1/subscriptions/select', {
                subscription_type: 'free',
                activation_code: values.activation_code
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'X-Tenant-ID': localStorage.getItem('"X-Tenant-ID')
                }
            });

            if (response.data.subscription_type === 'free') {
                navigate('/dashboard');
            } else {
                setError('Unexpected response from server');
            }
        } catch (error) {
            setError(error.response?.data?.detail || 'An error occurred during activation');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Nav />
            <section className='w-full h-screen flex items-center justify-center md:p-0 p-3'>
                <div className='max-w-[440px] w-full py-5 px-5 rounded-[12px] bg-[#E6EAFF17]'>
                    <h5 className='text-[22px] font-[700]'>Activate Subscription</h5>
                    <p className='text-[16px] font-[400] text-[#A5A3CB]'>Enter the activation code to continue.</p>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <div className='mt-5'>
                        <Formik
                            initialValues={{ activation_code: '' }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="form-group flex flex-col mb-4">
                                        <label className='mb-1 text-[#A5A3CB]'>Enter activation code</label>
                                        <Field 
                                            type="text" 
                                            name="activation_code" 
                                            className='bg-transparent border border-[#A5A3CB] rounded-[8px] px-2 py-2' 
                                            placeholder='xxxx-xxxx-xxxx-xxxx' 
                                        />
                                        <ErrorMessage name="activation_code" component="div" className="error text-red-500" />
                                    </div>
                                    <div className='flex gap-5 mt-5'>
                                        <Link to='/' className='w-[40%] text-center rounded-[8px] px-3 py-2 border border-[#1FD1F8] text-white'>
                                            Go Back
                                        </Link>
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting} 
                                            className='w-[40%] text-center rounded-[8px] px-3 py-2 bg-gradient-to-r from-[#1FD1F8] to-[#2FECD3] text-white'
                                        >
                                            {isSubmitting ? 'Activating...' : 'Activate'}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Activation;
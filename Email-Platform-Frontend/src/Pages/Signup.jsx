import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import Nav from '../Components/Nav';

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validationSchema = Yup.object({
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
            .required('Password is required'),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required'),
    });

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            const response = await axios.post('http://localhost:8000/api/v1/auth/register', {
                first_name: values.first_name,
                last_name: values.last_name,
                primary_email: values.email,
                password: values.password,
                confirm_password: values.confirm_password
            });

            console.log('Registration successful', response.data);
            navigate('/subscription');
        } catch (error) {
            console.error('Registration error', error.response?.data);
            if (error.response?.data?.detail) {
                setFieldError('email', error.response.data.detail);
            } else {
                setFieldError('email', 'An error occurred during registration');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0F0F1E] to-[#1A1A2E]">
            <Nav />
            <div className='w-full min-h-screen flex items-center justify-center px-4 py-12'>
                <div className='max-w-[440px] w-full py-8 px-6 rounded-[12px] bg-[#E6EAFF17] backdrop-blur-sm shadow-lg'>
                    <h2 className='text-3xl font-bold mb-2 text-white'>Sign Up</h2>
                    <p className='text-lg font-normal text-[#A5A3CB] mb-6'>Enter your information to get started</p>
                    <Formik
                        initialValues={{ first_name: '', last_name: '', email: '', password: '', confirm_password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="first_name" className='block mb-1 text-sm font-medium text-[#A5A3CB]'>First name</label>
                                        <Field type="text" id="first_name" name="first_name" className='w-full bg-transparent border border-[#A5A3CB] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#1FD1F8] transition duration-300' placeholder='John' />
                                        <ErrorMessage name="first_name" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="last_name" className='block mb-1 text-sm font-medium text-[#A5A3CB]'>Last name</label>
                                        <Field type="text" id="last_name" name="last_name" className='w-full bg-transparent border border-[#A5A3CB] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#1FD1F8] transition duration-300' placeholder='Doe' />
                                        <ErrorMessage name="last_name" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className='block mb-1 text-sm font-medium text-[#A5A3CB]'>Email</label>
                                    <Field type="email" id="email" name="email" className='w-full bg-transparent border border-[#A5A3CB] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#1FD1F8] transition duration-300' placeholder='your.email@example.com' />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="password" className='block mb-1 text-sm font-medium text-[#A5A3CB]'>Password</label>
                                    <div className="relative">
                                        <Field type={showPassword ? "text" : "password"} id="password" name="password" className='w-full bg-transparent border border-[#A5A3CB] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#1FD1F8] transition duration-300' placeholder='••••••••' />
                                        <button type="button" onClick={() => togglePasswordVisibility('password')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                            {showPassword ? <FaEyeSlash className="text-[#A5A3CB]" /> : <FaEye className="text-[#A5A3CB]" />}
                                        </button>
                                    </div>
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="confirm_password" className='block mb-1 text-sm font-medium text-[#A5A3CB]'>Confirm Password</label>
                                    <div className="relative">
                                        <Field type={showConfirmPassword ? "text" : "password"} id="confirm_password" name="confirm_password" className='w-full bg-transparent border border-[#A5A3CB] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#1FD1F8] transition duration-300' placeholder='••••••••' />
                                        <button type="button" onClick={() => togglePasswordVisibility('confirm')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                            {showConfirmPassword ? <FaEyeSlash className="text-[#A5A3CB]" /> : <FaEye className="text-[#A5A3CB]" />}
                                        </button>
                                    </div>
                                    <ErrorMessage name="confirm_password" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <button type="submit" disabled={isSubmitting} className='w-full rounded-lg py-3 bg-gradient-to-r from-[#1FD1F8] to-[#2FECD3] text-white font-semibold hover:opacity-90 transition duration-300 transform hover:scale-105'>
                                    {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                    <p className='mt-6 text-center text-sm text-[#A5A3CB]'>
                        Already a member? 
                        <Link to='/login' className='ml-1 font-medium text-[#1FD1F8] hover:text-[#2FECD3] transition duration-300'>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import Nav from '../Components/Nav';

const Login = () => {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post('http://35.172.141.151:8000/api/v1/auth/login', {
                username: values.email,
                password: values.password,
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            localStorage.setItem('token', response.data.access_token);
            navigate('/subscription');
        } catch (error) {
            console.error('Login error', error.response?.data);
            setLoginError(error.response?.data?.detail || 'An error occurred during login');
        } finally {
            setSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0F0F1E] to-[#1A1A2E]">
            <Nav />
            <div className='w-full min-h-screen flex items-center justify-center px-4 py-12'>
                <div className='max-w-[440px] w-full py-8 px-6 rounded-[12px] bg-[#E6EAFF17] backdrop-blur-sm shadow-lg'>
                    <h2 className='text-3xl font-bold mb-2 text-white'>Login</h2>
                    <p className='text-lg font-normal text-[#A5A3CB] mb-6'>
                        Enter your credentials to continue to <span className='text-[#1FD1F8]'>algoHunt</span>
                    </p>
                    {loginError && <p className='text-red-500 mb-4 text-sm'>{loginError}</p>}
                    <Formik
                        initialValues={{ email: '', password: '', rememberMe: false }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label htmlFor="email" className='block mb-1 text-sm font-medium text-[#A5A3CB]'>Email</label>
                                    <Field type="email" id="email" name="email" className='w-full bg-transparent border border-[#A5A3CB] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#1FD1F8] transition duration-300' placeholder='your.email@example.com' />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="password" className='block mb-1 text-sm font-medium text-[#A5A3CB]'>Password</label>
                                    <div className="relative">
                                        <Field type={showPassword ? "text" : "password"} id="password" name="password" className='w-full bg-transparent border border-[#A5A3CB] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#1FD1F8] transition duration-300' placeholder='••••••••' />
                                        <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                            {showPassword ? <FaEyeSlash className="text-[#A5A3CB]" /> : <FaEye className="text-[#A5A3CB]" />}
                                        </button>
                                    </div>
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <Field type="checkbox" name="rememberMe" className="form-checkbox h-4 w-4 text-[#1FD1F8] transition duration-150 ease-in-out" />
                                        <span className="ml-2 text-sm text-[#A5A3CB]">Remember Me</span>
                                    </label>
                                    <Link to='/forgotpassword' className='text-sm text-[#1FD1F8] hover:text-[#2FECD3] transition duration-300'>
                                        Forgot Password?
                                    </Link>
                                </div>
                                <button type="submit" disabled={isSubmitting} className='w-full rounded-lg py-3 bg-gradient-to-r from-[#1FD1F8] to-[#2FECD3] text-white font-semibold hover:opacity-90 transition duration-300 transform hover:scale-105'>
                                    {isSubmitting ? 'Logging in...' : 'Login'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                    <p className='mt-6 text-center text-sm text-[#A5A3CB]'>
                        New Member? 
                        <Link to='/signup' className='ml-1 font-medium text-[#1FD1F8] hover:text-[#2FECD3] transition duration-300'>
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
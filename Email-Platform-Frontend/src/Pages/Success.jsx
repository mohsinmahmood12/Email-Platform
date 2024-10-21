import React from 'react'
import Nav from '../Components/Nav'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { FaTiktok,FaCheck } from "react-icons/fa";

const Success = () => {
    const validationSchema = Yup.object({
        email: Yup.string()
          .email('Invalid email address')
          .required('Email is required'),
        
      });
  return (
    <>
        <Nav/>
        <section className='w-full h-screen flex items-center justify-center md:p-0 p-3'>
            <div className='max-w-[280px] w-full py-5 px-5 rounded-[12px] bg-[#E6EAFF17]'>
                <div className='w-[50px] h-[50px] m-auto rounded-[50%] border-[3px] border-[#219F94] flex justify-center items-center'>
                    <FaCheck className='text-[1.5rem]'/>
                </div>
                <h5 className='text-[22px] font-[400] text-center mt-3 mb-4'>Email Account Created</h5>
                <p className='text-[12px] text-center text-[#A5A3CB]'>Your account has been created successfully.</p>
                <Link to={'/dashboard'} className='w-full block mt-5 text-center rounded-[8px] px-3 py-2 bg-gradient-to-r from-[#1FD1F8] to-[#2FECD3] text-white'>
              Access Mail Now
            </Link>
            </div>
        </section>
    </>
  )
}

export default Success
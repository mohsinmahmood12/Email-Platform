import React from 'react'
import Nav from '../Components/Nav'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";

const Forgotpassword = () => {
    const validationSchema = Yup.object({
        email: Yup.string()
          .email('Invalid email address')
          .required('Email is required'),
        
      });
  return (
    <>
        <Nav/>
        <section className='w-full h-screen flex items-center justify-center md:p-0 p-3'>
            <div className='max-w-[440px] w-full py-5 px-5 rounded-[12px] bg-[#E6EAFF17]'>
                <h5 className='text-[22px] font-[700]'>Recover Password</h5>
                <p className='text-[16px] font-[400] text-[#A5A3CB]'>Enter your email and a code will be sent to your email.</p>
                <div className='mt-5 '>
                <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log('Form data', values);
          // You can add your login logic here
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group flex flex-col mb-4">
              <label className='mb-1 text-[#A5A3CB]'>Email</label>
              <Field type="email" name="email" className='bg-transparent border border-[#A5A3CB] rounded-[8px] px-2 py-2' placeholder='Ale**********@gmail.com' />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div className='flex gap-5 mt-5'>
            <Link to={'/login'} disabled={isSubmitting} className='w-[40%] text-center rounded-[8px] px-3 py-2 border border-[#1FD1F8] text-white'>
              Go Back
            </Link>
            <Link to={'/verify'} disabled={isSubmitting} className='w-[40%] text-center rounded-[8px] px-3 py-2 bg-gradient-to-r from-[#1FD1F8] to-[#2FECD3] text-white'>
               Next
            </Link>
            </div>
          </Form>
          
        )}
      </Formik>
                </div>
            </div>
        </section>
    </>
  )
}

export default Forgotpassword
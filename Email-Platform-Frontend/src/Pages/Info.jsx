import React from 'react'
import Nav from '../Components/Nav'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";

const Info = () => {
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
                <h5 className='text-[22px] font-[700]'>Sign Up</h5>
                <p className='text-[16px] font-[400] text-[#A5A3CB]'>Select a payment method</p>
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
            <div className="form-group mb-6">
              <div className="flex justify-between items-center mb-2 border py-2 px-2 rounded-[8px]">
                <label className="text-white">Credit/Debit Card</label>
                <Field
                  type="radio"
                  name="gender"
                  value="male"
                  className="form-radio h-4 w-4 text-blue-600"
                />
              </div>
              <ErrorMessage
                name="gender"
                component="div"
                className="text-red-500 text-sm mt-2"
              />
            </div>
            <div className="form-group flex flex-col mb-4">
              <label className='mb-1 text-[#A5A3CB]'>Cardholder Name</label>
              <Field type="text" name="email" className='bg-transparent border border-[#A5A3CB] rounded-[8px] px-2 py-2' placeholder='Enter here' />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div className="form-group flex flex-col mb-4">
              <label className='mb-1 text-[#A5A3CB]'>Card Number</label>
              <Field type="text" name="email" className='bg-transparent border border-[#A5A3CB] rounded-[8px] px-2 py-2' placeholder='**** **** **** ****' />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="form-group flex gap-[5px]  mb-4">
              <div className=''>
              <label className='mb-1 text-[#A5A3CB]'>Expiry</label>
              <Field type="text" name="email" className='bg-transparent border border-[#A5A3CB] rounded-[8px] px-2 py-2' placeholder='DD/YY' />
              <ErrorMessage name="email" component="div" className="error" />
              </div>
              <div className=''>
              <label className='mb-1 text-[#A5A3CB]'>CVV</label>
              <Field type="text" name="email" className='bg-transparent border border-[#A5A3CB] rounded-[8px] px-2 py-2' placeholder='***' />
              <ErrorMessage name="email" component="div" className="error" />
              </div>
              
            </div>
            <Link to={'/'} disabled={isSubmitting} className='w-[40%] text-center rounded-[8px] px-3 py-2 border border-[#1FD1F8] text-white'>
              Add Card
            </Link>

            <div className="form-group mb-6 mt-5">
              <div className="flex justify-between items-center mb-2 border py-2 px-2 rounded-[8px]">
                <label className="text-white">Paypal</label>
                <Field
                  type="radio"
                  name="gender"
                  value="male"
                  className="form-radio h-4 w-4 text-blue-600"
                />
              </div>
              <ErrorMessage
                name="gender"
                component="div"
                className="text-red-500 text-sm mt-2"
              />
            </div>

            <div className='flex gap-5 mt-5'>
            <Link to={'/'} disabled={isSubmitting} className='w-[40%] text-center rounded-[8px] px-3 py-2 border border-[#1FD1F8] text-white'>
              Go Back
            </Link>
            <Link to={'/setupemail'} disabled={isSubmitting} className='w-[40%] text-center rounded-[8px] px-3 py-2 bg-gradient-to-r from-[#1FD1F8] to-[#2FECD3] text-white'>
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

export default Info
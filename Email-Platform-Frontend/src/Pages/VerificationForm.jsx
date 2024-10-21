import React from 'react'
import Nav from '../Components/Nav'
import { Link } from 'react-router-dom'



const Forgotpassword = () => {
    
  return (
    <>
        <Nav/>
        <section className='w-full h-screen flex items-center justify-center md:p-0 p-3'>
            <div className='max-w-[340px] w-full py-5 px-5 rounded-[12px] bg-[#E6EAFF17]'>
                <h5 className='text-[22px] font-[700]'>Recover Password</h5>
                <p className='text-[16px] font-[400] text-[#A5A3CB]'>Enter the code sent to your email.</p>
                 <div className='mt-5'>
                 <label className='mb-1 text-[#A5A3CB]'>Code</label>
                 <div className="flex gap-[5px] mt-3">
                    <input type="text" className='border border-[grey] w-[32px] h-[32px] bg-transparent rounded-[8px]' />
                    <input type="text" className='border border-[grey] w-[32px] h-[32px] bg-transparent rounded-[8px]' />
                    <input type="text" className='border border-[grey] w-[32px] h-[32px] bg-transparent rounded-[8px]' />
                    <input type="text" className='border border-[grey] w-[32px] h-[32px] bg-transparent rounded-[8px]' />
                    <input type="text" className='border border-[grey] w-[32px] h-[32px] bg-transparent rounded-[8px]' />
                    <input type="text" className='border border-[grey] w-[32px] h-[32px] bg-transparent rounded-[8px]' />
                 </div>
                 <div className='flex gap-5 mt-5'>
            <Link to={'/forgotpassword'}  className='w-[40%] text-center rounded-[8px] px-3 py-2 border border-[#1FD1F8] text-white'>
              Go Back
            </Link>
            <Link to={'/'} className='w-[40%] text-center rounded-[8px] px-3 py-2 bg-gradient-to-r from-[#1FD1F8] to-[#2FECD3] text-white'>
               Next
            </Link>
            </div>
                 </div>
            </div>
        </section>
    </>
  )
}

export default Forgotpassword
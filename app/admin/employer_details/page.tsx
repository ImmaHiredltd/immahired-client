"use client"
import { User } from '@/components/allCandidates';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { UserData } from '../candidates/page';
import pp from '@/public/images/no-image.jpg'
import { LuLink } from 'react-icons/lu';
import Link from 'next/link';
import { useApproveUserMutation, useDisapproveUserMutation } from '@/app/api/general';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { EmpData } from '../employers/page';
import parse from 'html-react-parser';



export default function Details() {
   const [user, setUser] = useState<User | null>(null);
   const [candidate, setCandidate] = useState<EmpData | null>(null)
   const [submitId, {data, isLoading}] = useApproveUserMutation();
   const [submitIds, {data: disData, isLoading: disLoading}] = useDisapproveUserMutation();

   function formatTextWithLineBreaks(text: any) {
    if(text){
      return text.replace(/(\r\n|\n|\r)/g, "<br />");
    }else{
      return;
    }
  }

   useEffect(() => {
        if(localStorage){
            const user = localStorage.getItem('userData');
            const candidate = localStorage.getItem('candidateTalent');
            if(user){
                setUser(JSON.parse(user))
            }
            if(candidate){
                setCandidate(JSON.parse(candidate))
            }
        }
   }, [])

   const approveUser = async(e: any) => {
        e.preventDefault();
        try {
            const res = await submitId(candidate?.user).unwrap();
            if(res){
                toast('User approved');
                window.location.href = '/admin/employers';
            }
        } catch (error) {
            console.log(error)
        }
   } 

   const disapproveUser = async(e: any) => {
    e.preventDefault();
    try {
        const res = await submitIds(candidate?.user).unwrap();
        if(res){
            toast('User disapproved');
            window.location.href = '/admin/employers';
        }
    } catch (error) {
        console.log(error)
    }
} 
  return (
    <section className='space-y-5'>
        <ToastContainer />
        <h2 className='text-2xl font-semibold'>Employer details</h2>
        <button onClick={() => window.history.back()} className='flex items-center gap-2'>
            <FaArrowCircleLeft />
            Back
        </button>
        <div className='w-[200px] h-[200px] rounded-full overflow-hidden relative shadow-lg shadow-gray-400'>
            <Image 
                src={user?.image.url ? user?.image.url : pp}
                alt='Candidate image'
                fill
                className='object-cover'
            />
        </div>

        <div className='space-y-5'>
           <div>
                <p className='text-3xl font-semibold'>{candidate?.companyName}</p>
                <p className='font-semibold mt-10 text-xl text-main'>Company Information</p>
                <div className=' '>
                    <div className='space-y-3 mt-5 '>
                        <p className='flex flex-col'><span className='font-semibold '>Contact informaation </span>{candidate?.contactInformation && parse(formatTextWithLineBreaks(candidate?.contactInformation))}</p>
                        <div className='flex gap-3'>
                            <p className='flex flex-col w-1/2 pr-5 border-r border-black'> <span className='font-semibold'>Company overview </span><span className='text-sm'>{candidate?.overview}</span></p>
                            <p className='flex-col flex w-1/2 pr-5'> <span className='font-semibold'>Equal opportunity statement </span><span className='text-sm'>{candidate?.equalOpportunityStatement}</span></p>
                        </div>
                    </div>
                        { candidate?.shortVideo.url && 
                        <div className='flex flex-col gap-3 w-1/2 mt-3'>
                            <span className='text-sm relative h-[200px] sm:h-[300px] flex items-center justify-center shadow-md shadow-gray-400 rounded-xl  overflow-hidden  bg-gray-200 w-full'>
                                    
                                        <video 
                                            src={candidate?.shortVideo.url}
                                            controls
                                            className="absolute inset-0 object-cover w-full h-full"
                                        ></video>
                            </span>
                        </div>
                        }
                </div>
           </div>
           
           <hr />

           <p className='font-semibold mt-10 text-xl'>Personal Information</p>
            
            <div className='flex gap-10 '>  
                <p className='w-1/2'>{user?.lastName} {user?.name}</p>
                <p className='w-1/2'>{user?.phoneNumber}</p>
            </div>

            <div className='flex gap-10 '>
                <p className='w-1/2'>{user?.email}</p>
                <p className={`${user?.approved ? 'text-yellow-600' : 'text-red-500'} w-1/2`}>Status: {user?.approved ? 'Approved' : 'Pending'}</p>
            </div>

            
        </div>

        <div className='flex gap-5 text-sm pt-20'>
                <button disabled={isLoading || user?.approved} onClick={approveUser} className={` px-10 rounded py-2 text-white ${user?.approved ? 'bg-gray-400' : 'bg-main'} `}>
                    {isLoading ? 'Approving...' :  'Approve'}
                </button>
                <button onClick={disapproveUser} className='px-10 py-2 bg-black text-white rounded'>
                    {disLoading ? 'Disapproving...' :  'Disapprove'}
                </button>
            </div>

    </section>
  )
}

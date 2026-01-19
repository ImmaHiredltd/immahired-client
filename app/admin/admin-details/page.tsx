"use client"
import { useApproveUserMutation, useDisapproveUserMutation } from '@/app/api/general';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Admins } from '../admins/page';
import { FaArrowCircleLeft } from 'react-icons/fa';
import pp from '@/public/images/no-image.jpg'


export default function AdminDetails() {
    const [candidate, setCandidate] = useState<Admins | null>(null);
    const [submitId, {data, isLoading}] = useApproveUserMutation();
    const [submitIds, {data: disData, isLoading: disLoading}] = useDisapproveUserMutation();
 
    useEffect(() => {
         if(localStorage){
             const candidate = localStorage.getItem('candidateTalent');
             if(candidate){
                 setCandidate(JSON.parse(candidate))
             }
         }
    }, [])
 
    const approveUser = async(e: any) => {
         e.preventDefault();
         try {
             const res = await submitId(candidate?.id).unwrap();
             if(res){
                 toast('User approved');
                    window.location.href = '/admin/admins';
             }
         } catch (error) {
             console.log(error)
         }
    } 
 
    const disapproveUser = async(e: any) => {
     e.preventDefault();
     try {
         const res = await submitIds(candidate?.id).unwrap();
         if(res){
             toast('User disapproved');
                window.location.href = '/admin/admins';
         }
     } catch (error) {
         console.log(error)
     }
 } 
  return (
    <section className='space-y-5'>
    <ToastContainer />
    <h2 className='text-2xl font-semibold'>Candidate details</h2>
    <button onClick={() => window.history.back()} className='flex items-center gap-2'>
        <FaArrowCircleLeft />
        Back
    </button>
    <div className='w-[200px] h-[200px] rounded-full overflow-hidden relative shadow-lg shadow-gray-400'>
        <Image 
            src={candidate?.image.url ? candidate?.image.url : pp}
            alt='Candidate image'
            fill
            className='object-cover'
        />
    </div>

    <div className='w-1/2 space-y-5'>
        <div className='flex gap-10 '>
            <p className='w-1/2'>{candidate?.lastName} {candidate?.name}</p>
            <p className='w-1/2'>{candidate?.phoneNumber}</p>
        </div>

        <div className='flex gap-10 '>
            <p className='w-1/2'>{candidate?.email}</p>
            <p className={`${candidate?.approved ? 'text-yellow-600' : 'text-red-500'} w-1/2`}>Status: {candidate?.approved ? 'Approved' : 'Pending'}</p>
        </div>

        <div className='flex gap-10 '>
            <p className='w-1/2'>{candidate?.location}</p>
            <p className='w-1/2'>{candidate?.gender}</p>
        </div>
        
    </div>

    <div className='flex gap-5 text-sm pt-20'>
            <button disabled={isLoading || candidate?.approved} onClick={approveUser} className={` px-10 rounded py-2 text-white ${candidate?.approved ? 'bg-gray-500' : 'bg-main'} `}>
                {isLoading ? 'Approving...' :  'Approve'}
            </button>
            <button onClick={disapproveUser} className='px-10 py-2 bg-black text-white rounded'>
                {disLoading ? 'Disapproving...' :  'Disapprove'}
            </button>
        </div>

</section>
  )
}

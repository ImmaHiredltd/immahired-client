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


export default function Details() {
   const [user, setUser] = useState<User | null>(null);
   const [candidate, setCandidate] = useState<UserData | null>(null)
   const [submitId, {data, isLoading}] = useApproveUserMutation();
   const [submitIds, {data: disData, isLoading: disLoading}] = useDisapproveUserMutation();

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
                window.location.href = '/admin/candidates';
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
            window.location.href = '/admin/candidates';
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
                src={user?.image.url ? user?.image.url : pp}
                alt='Candidate image'
                fill
                className='object-cover'
            />
        </div>

        <div className='w-1/2 space-y-5'>
            <div className='flex gap-10 '>
                <p className='w-1/2'>{user?.lastName} {user?.name}</p>
                <p className='w-1/2'>{user?.phoneNumber}</p>
            </div>

            <div className='flex gap-10 '>
                <p className='w-1/2'>{user?.email}</p>
                <p className={`${user?.approved ? 'text-yellow-600' : 'text-red-500'} w-1/2`}>Status: {user?.approved ? 'Approved' : 'Pending'}</p>
            </div>

            <div className='flex gap-10 '>
                <p className='w-1/2'>{user?.location}</p>
                <p className='w-1/2'>{user?.gender}</p>
            </div>

            <div className='flex gap-5'>
                <Link target='_blank' href={candidate?.resume.url ? candidate?.resume.url : '#'} aria-disabled className={`${!candidate?.resume.url ? 'text-gray-500 opacity-50 pointer-events-none cursor-not-allowed' : 'text-main opacity-100 '} flex items-center gap-2 text-sm rounded hover:text-main/70 w-1/2 `}>Download Resume <LuLink /></Link>
                <Link target='_blank' href={candidate?.certificate.url ? candidate?.certificate.url : '#'} className={`${!candidate?.certificate.url ? 'text-gray-500 opacity-50  pointer-events-none cursor-not-allowed' : 'text-main opacity-100'} flex items-center gap-2 text-sm rounded hover:text-main/70 `}>Download Certificate <LuLink /></Link>
            </div>

            
        </div>

        <div className='flex gap-5 text-sm pt-20'>
                <button disabled={isLoading || user?.approved} onClick={approveUser} className={` px-10 rounded py-2 text-white ${user?.approved ? 'bg-gray-500' : 'bg-main'} `}>
                    {isLoading ? 'Approving...' :  'Approve'}
                </button>
                <button onClick={disapproveUser} className='px-10 py-2 bg-black text-white rounded'>
                    {disLoading ? 'Disapproving...' :  'Disapprove'}
                </button>
            </div>

    </section>
  )
}

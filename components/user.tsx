"use client"
import Image from 'next/image'
import React, { useEffect } from 'react'
import pp from "@/public/images/no-image.jpg"
import { useRouter } from 'next/navigation'
import { useGetPackageStatusQuery, useGetTalentMutation, useGetUserMutation } from '@/app/api/general';

export default function User({user}: any) {
    const [ submitData ] = useGetTalentMutation();
    const [ submitId, { data, isLoading } ] = useGetUserMutation();
    const { data: statusData, isLoading: statusLoading } = useGetPackageStatusQuery(null)
    const route = useRouter();


    useEffect(() => {
        async function getUser(){
            try{
                const res = await submitData(user.talent).unwrap();
                if(await res){
                    try{
                        const check = await submitId(res.data.user).unwrap();
                        console.log(await check)
                    }catch(err){
                        console.error(err)
                    }
                }
            }catch(err){
                console.error(err)
            }
        }
        getUser()
    }, [])  

    const goToChat = () => {
        if(localStorage){
            localStorage.setItem('profile', JSON.stringify(data.data))
            route.push('/employer/messages/chat');
        }
    }

  return (
    <>
        {
            isLoading && (
                <div>
                    Loading...
                </div>
            )
        }
        {    data && (<div className='py-3 flex items-center justify-between'>
                            <div className='flex gap-3 items-center '>
                                <div className='relative w-[60px] h-[60px] rounded-full overflow-hidden shadow-md shadow-gray-400 '>
                                    <Image 
                                        src={data.data.profileImage ? data.data.profileImage.url : pp}
                                        alt='Candidate Image'
                                        fill
                                        className='object-cover'
                                    />
                                </div>
                                <div className='flex flex-col gap-2 justify-center text-xs sm:text-sm text-gray-300'>
                                    <span>{data.data.lastName} {data.data.name}</span>
                                    <span>{statusData?.data.canViewTalentsContacts ?  data.data.email : '******'}</span>
                                </div>
                            </div>
                            <button onClick={goToChat} className='bg-main px-5 py-2 text-xs sm:text-sm rounded h-fit'>Message</button>
        </div>)}
        </>
  )
}

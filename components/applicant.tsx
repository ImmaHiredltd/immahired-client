import { useGetPackageStatusQuery, useGetTalentMutation, useGetUserMutation } from '@/app/api/general'
import Image from 'next/image';
import React, { useEffect } from 'react'
import { CiLocationArrow1 } from 'react-icons/ci';
import { PiSpinner } from 'react-icons/pi';
import pp from '@/public/images/no-image.jpg'
import { useRouter } from 'next/navigation';


export default function Applicant({info}: any) {
    const [submitId] = useGetTalentMutation();
    const [submitTalent, {data, isLoading}] = useGetUserMutation();
    const { data: statusData, isLoading: statusLoading } = useGetPackageStatusQuery(null)

    const route = useRouter()

    useEffect(() => {
        localStorage.setItem('job', JSON.stringify(info));
        async function getTalent(){
            try{
                const res = await submitId(info.talent).unwrap();
                if(await res){
                    localStorage.setItem('talent', JSON.stringify(res.data));
                    try{
                        const check = await submitTalent(res.data.user).unwrap();
                        console.log(await check)
                    }catch(err){
                        console.error(err)
                    }
                }
            }catch(err){
                console.error(err)
            }
        }
        getTalent()
    }, []);

    const viewProfile = (data: any) => {
        if(localStorage){
            localStorage.setItem('profile',JSON.stringify(data));
            localStorage.setItem('applicant',JSON.stringify(info));
            route.push('/employer/candidate');
        }
    }
  return (
            <div className='mt-5'>
                {isLoading && (
                <div>
                    <PiSpinner className="animate-spin text-6xl" />
                </div>
                )}
                {data && (
                    <button onClick={() => viewProfile(data.data)} className='flex justify-between mt-2 items-center p-2 rounded-xl hover:bg-gray-700 w-full'>
                        <div className='flex gap-2 items-center'>
                            <div className='relative w-[60px] h-[60px] overflow-hidden rounded-full shadow-md shadow-gray-400'>
                                <Image 
                                    alt='Candidate profile image'
                                    src={data ? data?.data?.profileImage?.url : pp}
                                    fill
                                    className='object-cover'
                                />
                            </div>
                            <div className='flex flex-col text-gray-300 items-start text-sm'>
                                <span>{data?.data.lastName} {data?.data.name}</span>
                                <span>{statusData?.data.canViewTalentsContacts ?  data?.data.email : '******'}</span>
                            </div>
                        </div>
                        <div className='rounded bg-main p-3 text-white text-xl h-fit '>
                            <CiLocationArrow1 />
                        </div>
                    </button>
                )}
            </div>
  )
}

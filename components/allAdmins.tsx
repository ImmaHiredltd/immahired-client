import { Admins } from '@/app/admin/admins/page'
import moment from 'moment';
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation';
import pp from '@/public/images/no-image.jpg'


export default function AllAdmins({ info }: { info: Admins }) {
    const route = useRouter();

    const handleProfile = (e: any) => {
        e.preventDefault();
        if (localStorage) {
            localStorage.setItem('candidateTalent', JSON.stringify(info))
            route.push('/admin/admin-details');
        }
    }
    return (
        <section className='w-[90%] sm:w-[22%] h-fit min-h-[290px]'>
            <div className='w-full h-[350px] sm:h-[250px]  relative'>
                <Image
                    src={info?.profileImage.url ? info.profileImage.url : pp}
                    alt='Image'
                    fill
                    className='object-cover'
                />
            </div>

            <div className='flex flex-col gap-2 py-2 text-xs bg-gray-100 px-2 relative'>
                <p className={`${info?.approved ? 'bg-white text-black' : 'bg-red-500/50 text-red-500'} absolute rounded-full px-3 py-1 shadow-md shadow-gray-400  right-2 top-2 text-[10px]`}>
                    {info?.approved ? 'Approved' : 'Pending'}
                </p>
                <p className='font-semibold'>{info?.lastName} {info?.name}</p>
                <p>{info?.email}</p>
                <p className=''><span className='font-semibold'>Joined: </span>{moment(info?.createdAt).format('DD/MM/YYYY')}</p>
            </div>

            <button onClick={handleProfile} className='bg-black w-full text-white py-3 text-center rounded text-xs hover:bg-black/70 '>View Profile</button>
        </section>
    )
}

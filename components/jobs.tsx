import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import pp from "@/public/images/Frame 267.png"
import { CiBookmark, CiLocationOn } from 'react-icons/ci'
import { TfiWallet } from "react-icons/tfi";
import { FaBookmark, FaBox } from 'react-icons/fa6';
import { PiBriefcase, PiSpinner } from 'react-icons/pi';
import { useRouter } from 'next/navigation';
import { JobData } from '@/app/context';
import Cookies from 'js-cookie';
import { useGetTalentMutation, useGetUserMutation, useSaveJobMutation, useUnsaveJobMutation } from '@/app/api/general';
import { MdOutlineGeneratingTokens } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetEmployerQuery } from '@/app/api/features/employer';
import { TbBuildingSkyscraper, TbFileDescription } from "react-icons/tb";
import ppp from '@/public/images/difference-between-firm-and-company3.png'
import { BiSolidHot } from "react-icons/bi";


export default function Job({ data }: any) {
    const [jobDetails, setJobDetails] = useContext(JobData);
    const [submitId, { isLoading, data: repData }] = useSaveJobMutation();
    const [submitJobId, { data: resData, isLoading: loading }] = useUnsaveJobMutation();
    const [submitToken, { data: canData }] = useGetTalentMutation();
    const { data: empData, isLoading: empLoading } = useGetEmployerQuery(data.employer)
    const [submitEmp, { data: useData, isLoading: userLoading }] = useGetUserMutation()
    const [savePressed, setSavePressed] = useState(true)
    const [unsavePressed, setunSavePressed] = useState(true)

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await submitEmp(empData.data.user).unwrap();
                console.log(res)
            } catch (err) {
                console.error(err)
            }
        }
        getUser();
    }, [empData])

    const user = Cookies.get('user');
    var userData: any;
    if (user) {
        userData = JSON.parse(user);
    }

    console.log(empData)

    const route = useRouter();
    const handleJob = () => {
        if (Cookies.get('user')) {
            if (userData.data.type === 'employer') return;
            Cookies.set('jobId', JSON.stringify(data.id), { expires: 1 })
            if (useData?.data.image.url) {
                localStorage.setItem('compImage', useData.data.logo.url)
            } else {
                localStorage.setItem('compImage', 'No image')
            }
            localStorage.setItem('employer', JSON.stringify(data.employer))
            route.push('/jobs/job-details');
            console.log(data)
            setJobDetails(data);
        } else {
            localStorage.setItem('employer', JSON.stringify(data.employer))
            Cookies.set('jobId', JSON.stringify(data.id), { expires: 1 });
            route.push('/jobs/job-details');
            setJobDetails(data);
        }
    }

    useEffect(() => {
        const talent = Cookies.get('user');
        var talentData: any;
        if (talent) {
            talentData = JSON.parse(talent);
        }
        async function getTalent() {
            if (talentData) {
                try {
                    const res = await submitToken(talentData.data.id).unwrap()

                } catch (err) {
                    console.error(err)
                }
            }
        }
        getTalent()
    }, [resData, repData])

    console.log("candidate", canData)

    const handleBookmark = async (id: string) => {
        setSavePressed(!savePressed)
        try {
            const res = await submitId(id).unwrap();
            if (await res) {
                toast('Job Bookmarked!')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleUnBookmark = async (id: string) => {
        setunSavePressed(!unsavePressed)
        try {
            const res = await submitJobId(id).unwrap();
            console.log("delete: ", await res)
            if (await res) {
                toast('Job Removed from bookmarks!')
            }
        } catch (err) {
            console.log(err)
        }
    }

    // console.log(empData)
    function truncateText(text: string, maxLength: number) {
        return text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    }

    return (
        <section onClick={handleJob} className=' sm:w-[47%] w-full min-w-[330px] transition-transform transform hover:scale-105 duration-300 text-sm gap-3 h-[170px] flex items-center shadow-md shadow-gray-500 rounded-xl bg-gray-100 text-black px-5 py-3'>
            <div onClick={handleJob} className={`p-2 relative w-16 h-16 overflow-hidden flex items-center justify-center cursor-pointer rounded-full text-white text-xs bg-gray-700`}>
                {
                    userLoading && (
                        <PiSpinner className='animate-spin text-2xl ' />
                    )
                }
                {
                    data && data.employer.logo?.filename && (
                        <Image
                            src={`https://immahired.cn/api/uploads/${data.employer.logo.filename}`}
                            fill
                            alt='Company image'
                            className='object-cover'
                        />
                    )
                }
                {
                    data && !data.employer.logo?.filename && (
                        <Image
                            src={ppp}
                            fill
                            alt='Company image'
                            className='object-cover'
                        />
                    )
                }
            </div>
            <div onClick={handleJob} className={`space-y-2 w-[68%] ${userData && userData.data.type === 'employer' ? '' : 'cursor-pointer'} ${!user && 'cursor-pointer'}`}>
                <div className='font-semibold text-gray-900 flex items-center gap-2'>
                    <span className='rounded-full text-black'><TbBuildingSkyscraper /></span>
                    <span className='text-xs'>{data && truncateText(data.employer.companyName, 20)}</span>
                </div>
                <div className='flex gap-5 text-xs items-center'>
                    <span className='text-black font-semibold'>{truncateText(data.title, 25)}</span>
                    <span className='text-green-800 text-xs'>{data.industry}</span>
                </div>
                {
                    <div className='text-xs text-black flex items-center gap-2'>
                        <TbFileDescription className='text-xl' />
                        <span>
                            {data.description && truncateText(data.description, 50)}
                        </span>
                    </div>
                }
                <div className='text-black flex items-center justify-between'>
                    <span className='flex items-center gap-1 text-xs sm:w-1/2'>
                        <span className='text-xl'><CiLocationOn /></span>
                        <span>{data && data.city}, {truncateText(data.location, 20)}</span>
                    </span>
                    {data.salaryRangeMin !== 0 && data.salaryRangeMax !== 0 &&
                        <span className='flex items-center gap-1 text-[10px]'>
                            <TfiWallet className='text-sm' />
                            <span>¥{data.salaryRangeMin.toLocaleString()} - ¥{data.salaryRangeMax.toLocaleString()}</span>
                        </span>
                    }
                </div>

                <div className='flex items-center justify-between'>
                    <span className='bg-white rounded-lg px-3 py-1 text-xs'>{data.employmentType}</span>
                    {data.views > 0 && <span className='flex items-center gap-1 text-[10px] text-black font-bold'>
                        <BiSolidHot className='text-gray-400 text-lg' />
                        {data.views}
                    </span>}
                </div>
            </div>
            <div className={`${userData && userData?.data.type === 'employer' ? 'hidden' : 'block'} ${!user && 'hidden'} h-full`}>
                <button className="p-2 h-fit hover:bg-gray-800 flex items-center justify-center rounded-full bg-gray-700  font-semibold text-white text-xl">
                    {
                        canData && canData.data.savedJobs.includes(data.id) ? <FaBookmark onClick={() => handleUnBookmark(data.id)} className='text-blue-400 text-lg' /> : isLoading ? '...' : <CiBookmark onClick={() => handleBookmark(data.id)} />
                    }
                </button>
            </div>
        </section>
    )
}

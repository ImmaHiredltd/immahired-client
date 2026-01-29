"use client"
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import pp from '@/public/images/no-image.jpg'
import { Navs } from './candidateNav'
import { usePathname } from 'next/navigation';
import { LanguageData } from '@/app/context';
import navLanguage from "@/app/employer/page.json"
import { MdOutlineDashboard, MdVerified } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { FaBox, FaBoxesStacked, FaRegBell } from 'react-icons/fa6';
import { LuMessagesSquare, LuPencil } from 'react-icons/lu';
import { CiBookmark } from 'react-icons/ci';
import { RiLockPasswordLine } from 'react-icons/ri';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoCheckmarkDoneSharp, IoEarthSharp, IoLogOutOutline } from 'react-icons/io5';
import Link from 'next/link';
import { UserData } from '@/app/tokenContext'
import Cookies from 'js-cookie'
import { useGetMeQuery, useGetUserMutation } from '@/app/api/general'

export default function EmployerNav({inView, onClose }: { inView: boolean, onClose : () => void }) {
  const jsonData : any = navLanguage;
  const languageContext = useContext(LanguageData); 
  const pathName = usePathname();
  const [active, setActive] = useContext(UserData);
  // const [ submitUserToken, { data: userData, isLoading: userLoading } ] = useGetUserMutation();
  const token = Cookies.get('token');
  var tokenData: any;
  if(token){
    tokenData = JSON.parse(token);
  }

  const { data: userData, isLoading: userLoading } = useGetMeQuery(tokenData?.data?.id);
  const [userInfo, setUserInfo] = useState({
    name: tokenData?.data.name,
    lastName: tokenData?.data.lastName,
    email: tokenData?.data.email,
    image: tokenData?.data.image.url
  })
  
  if (!languageContext) {
    throw new Error('Navbar must be used within a LanguageProvider');
  }

    const [language, setLanguage] = languageContext;
    const target = jsonData[language]

    const navs: Navs[] = [
        {
            id: 1,
            ref: "/employer",
            icon: MdOutlineDashboard,
            name: target.user_dashboard
        },
        {
            id: 2,
            ref: "/employer/profile",
            icon: FaRegUser,
            name: target.profile
        },
        {
            id: 3,
            ref: "/employer/my-jobs",
            icon: FaBox,
            name: target.my_jobs
        },
        {
            id: 4,
            ref: "/employer/submit-job",
            icon: LuPencil,
            name: target.submit_jobs
        },
        // {
        //     id: 5,
        //     ref: "/employer/applicants",
        //     icon: FaRegBell,
        //     name: target.app_jobs
        // },
        {
            id: 6,
            ref: "/employer/shortlisted-candidates",
            icon: IoCheckmarkDoneSharp,
            name: target.short_candidates
        },
        // {
        //     id: 7,
        //     ref: "/employer/candidates-alerts",
        //     icon: FaRegBell,
        //     name: target.candidate_alerts
        // },
        {
            id: 8,
            ref: "/employer/packages",
            icon: FaBoxesStacked,
            name: target.packages
        },
        {
            id: 9,
            ref: "/employer/messages",
            icon: LuMessagesSquare,
            name: target.messages
        },
        {
            id: 10,
            ref: "/employer/change",
            icon: RiLockPasswordLine,
            name: target.change_pass
        },
        // {
        //     id: 11,
        //     ref: "/employer/delete-account",
        //     icon: AiOutlineDelete,
        //     name: target.del_profile
        // },
    ]

    const handleChange = (e: any) => {
      console.log(e.target.value);
      setLanguage(e.target.value);
      if(localStorage){
        localStorage.setItem('locale', e.target.value);
      }
    }

    // useEffect(() => {
    //     async function getUsers(){
    //         try{
    //             const user = await submitUserToken(tokenData.data.id).unwrap();
    //         }catch(err){
    //             console.error(err)
    //         }
    //     }
    //     getUsers()
    //   }, [])

    console.log(userData)

      useEffect(() => {
        if(userData){
          setUserInfo({
            name: userData.data.name,
            lastName: userData.data.lastName,
            image: userData.data.image.url,
            email: userData.data.email
          })
        }
    }, [userData])

    const logout = (e: any) => {
      e.preventDefault();
      setActive(false);
      Cookies.remove('token');
    }

  return (
    <section className={`w-[70vw] z-50 lg:w-[20vw] md:w-[40%] bg-primary h-screen p-5 flex flex-col justify-between xl:relative text-white absolute xl:translate-x-0 ${!inView && "-translate-x-[200%] transition-all"}`}>
        {/* <div className="flex gap-1 items-center text-xs mb-5">
              <label><IoEarthSharp color='white' /></label>
              <select onChange={(e) => handleChange(e)} name="language" id="language" className='bg-primary text-white'>
                <option value="en">English</option>
                <option value="cn">中国人</option>
                <option value="es">español</option>
              </select>
          </div> */}
        <div>
            <div className='w-full h-[65px] flex gap-2 text-white'>
              <div className='w-[25%] h-full bg-gray-100 overflow-hidden rounded-full relative border-2 border-gray-300'>
                {
                  userData?.data?.logo?.url ? 
                  <Image
                    alt='Profile Image'
                    src={userData?.data?.profileImage?.url}
                    fill
                    className='object-cover'
                  /> :
                  <Image
                    alt='Profileasda Image'
                    src={pp}
                    fill
                    className='object-cover'
                  />
                }
                
              </div>
              <div className='flex flex-col justify-evenly'>
                  {
                    userData && (
                      <>
                        <span className='font-semibold tracking-wide text-sm flex items-center gap-2'>{userInfo.lastName} {userInfo.name} {tokenData?.data.approved && <MdVerified />}</span>
                        <span className='text-sm'>{userInfo.email}</span>
                      </>
                      )
                  }
              </div>
            </div>
        </div>

        <div className='space-y-3 text-sm'>
              {
                  navs.map((nav: Navs, index:number) => 
                  <Link onClick={onClose} key={index} href={nav.ref} className={`${pathName === nav.ref ? "bg-main" : ''} flex items-center gap-3 px-2 py-3 rounded-lg`}>
                      <nav.icon className='text-lg' />
                      {nav.name}
                  </Link>
                )
              }
        </div>

        <button onClick={logout} className='flex items-center gap-3 px-2 text-sm'>
            <IoLogOutOutline className='text-lg' />
            <span>{target.logout}</span>
        </button>

    </section>
  )
}

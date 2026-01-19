"use client"
import React, { useContext, useEffect, useState } from 'react'
import lang from "@/app/admin/page.json"
import { LanguageData } from '../context';
import Chart from '@/components/adminChart';
import Notifications from '@/components/notification';
import Cookies from 'js-cookie';
import { useApplicationsQuery } from '../api/features/candidates';
import { PiDropboxLogoLight, PiSpinner } from 'react-icons/pi';
import { useGetAnalyticsQuery, useGetContactsQuery, useGetTalentMutation } from '../api/general';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FaUserCheck, FaUserClock } from 'react-icons/fa6';
import { MdPendingActions } from 'react-icons/md';


const jsonData: any = lang;

export default function Page() {
  const languageContext = useContext(LanguageData);

    if (!languageContext) {
    throw new Error("LanguageData context is not provided!");
    }

    const [language, setLanguage] = languageContext;
    const target = jsonData[language]

    const token = Cookies.get('token');
    var userData: any;
    if(token){
      userData = JSON.parse(token);
    }
    // const { isLoading, data } = useApplicationsQuery(userData ? userData.token : null)
    const [ submitToken, { data: talentData, isLoading:talentLoading } ] = useGetTalentMutation();
    const { data: contactData, isLoading: contactLoading } = useGetContactsQuery(null);
    const { data:applicationData, isLoading: applicationLoading } = useApplicationsQuery(null);
    const { data, isLoading } = useGetAnalyticsQuery(null)

    const approvedCount = applicationData && applicationData.data.filter((item: any) => item.approved).length;

    const dashCards = [
      {
        id: 1,
        icon: FaUserCheck,
        title: target.registered_candidates,
        numbers: data && data.data.totalCandidates,
        color: "skyblue"
      },
      {
        id: 1,
        icon: PiDropboxLogoLight,
        title: target.registered_employers,
        numbers: data && data.data.totalEmployers,
        color: "green"
      },
      {
        id: 1,
        icon: FaUserClock,
        title: target.pending_candidates,
        numbers: data && data.data.totalPendingCandidates,
        color: "yellow"
      },
      {
        id: 1,
        icon: MdPendingActions,
        title: target.pending_employers,
        numbers: data && data.data.totalPendingEmployers,
        color: "white"
      },
    ]

    

    useEffect(() => {
      const talent = Cookies.get('user');
        var talentData: any;
        if(talent){
            talentData = JSON.parse(talent);
        }
      async function getTalent(){
        try{
          const res = await submitToken(talentData.data.id).unwrap();
        }catch(err){
          console.error(err)
        }
      }
      getTalent()
    }, []);
    
  return (
    <section className='w-full'>
        <div className='text-xl space-y-2'>
          <div className='font-bold'>{target.welcome_back} 👋</div>
          <div className='text-sm font-semibold'>Admin</div>
        </div>
        
        <div className='mt-12 space-y-5'>
            <h1 className='text-2xl'>{target.app_stat}</h1>
            <div className='flex lg:flex-row flex-col gap-2 justify-between'>
                {
                  dashCards.map((card, index) => 
                    <div key={index} className='rounded-lg text-white shadow-md shadow-gray-400 bg-primary p-5 w-full md:w-[35%] lg:w-[24%] flex items-center justify-between'>
                        <div className={`bg-gray-600 h-fit w-fit rounded-xl p-3 text-2xl`} style={{ color: card.color}}>
                            <card.icon />
                        </div>
                        <div className="space-y-3">
                            <div style={{ color:card.color }} className='text-4xl flex justify-end'>{isLoading  ? <PiSpinner className='animate-spin text-2xl ' /> : card.numbers}</div>
                            <div>{card.title}</div>
                        </div>
                    </div>
                  )
                }
            </div>
        </div> 

        <div className='flex lg:flex-row flex-col justify-between gap-3 w-full mt-10 '>
          <div className=' bg-abstract shadow-md shadow-gray-300 w-full sm:w-[80%] lg:w-auto rounded-xl text-white p-2 sm:p-5'>
              <h1 className='text-xl px-5'>{target.registered_users}</h1>
             <Chart />
          </div>

          <Notifications target={target} />
        </div>
    </section>
  )
}

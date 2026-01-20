"use client"
import Header from '@/components/headers'
import React, { useContext, useEffect, useState } from 'react'
import lang from "@/app/employer/my-jobs/page.json";
import { LanguageData } from '@/app/context';
import Applicant from '@/components/applicant';
import { FaPeopleGroup } from 'react-icons/fa6';

export default function Applicants(){
  const languageContext = useContext(LanguageData);
  const  [applicants, setApplicants] = useState([]);
  if (!languageContext) {
    throw new Error("LanguageData context is not provided!");
  }

  const [language] = languageContext;
  const jsonData: any = lang;
  const target = jsonData[language];

  
  useEffect(() => {
    const app = localStorage.getItem('applicants')
    if(app){
        setApplicants(JSON.parse(app));
    }
  }, [])

  return (
    <section className='sm:px-banner-clamp'>
        <div className='text-2xl flex gap-3 items-center'>
                <span className='text-main text-6xl'><FaPeopleGroup /></span>
                {target.application}
            </div>

        <div className='rounded-xl bg-abstract shadow-lg shadow-gray-400 py-5 px-5 sm:px-10 w-full mt-5 text-white'>
            <h2 className='text-lg'>{applicants.length} Applicant(s) Found</h2>
            {
                applicants && applicants.map((data, index) => <Applicant key={index} info={data} />)
            }
        </div>
    </section>
  )
}

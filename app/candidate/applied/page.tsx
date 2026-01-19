"use client"
import Header from '@/components/headers'
import React, { useContext, useEffect, useState } from 'react'
import lang from "./page.json"
import { LanguageData } from '@/app/context';
import Input from '@/components/input';
import { FaSearch } from 'react-icons/fa';
import AppliedJob from '@/components/appliedJob';
import { useApplicationsQuery } from '@/app/api/features/candidates';
import Cookies from 'js-cookie';
import { BsBellFill } from 'react-icons/bs';

const jsonData: any = lang;
export default function Applied() {
    const token = Cookies.get('token');
    var tokenData: any;
    if(token){
        tokenData = JSON.parse(token);
    }
    const languageContext = useContext(LanguageData);
    const { isLoading, data } = useApplicationsQuery(null)

    if (!languageContext) {
    throw new Error("LanguageData context is not provided!");
    }

    const [language, setLanguage] = languageContext;
    const target = jsonData[language]

    useEffect(() => {
        
    }, [data])
  return (
    <section className='px-'>
        <div className='mt-10 sm:w-[80%] w-full'>
            <div className='text-2xl flex gap-3 items-center'>
                <span className='text-main text-6xl'><BsBellFill /></span>
                {target.applied_jobs}
            </div>
            <div className='w-full bg-primary shadow-xl shadow-gray-400 p-3 sm:p-8 rounded-xl mt-3 text-white space-y-8'>
                {/* <div className='w-full max-sm:text-sm  lg:w-[40%] rounded-xl border border-main p-2 bg-white text-black flex items-center'>
                    <input placeholder={target.search} className='w-[90%] focus:outline-none' />
                    <button className='h-full flex items-center p-2 rounded-md text-main justify-center'>
                        <FaSearch />
                    </button>
                </div> */}

                <div className=''>
                    <h3 className='text-sm'>{data && data.data.length + " " + target.app_found}</h3>
                    <div>
                        {isLoading && 'Loading...'}
                        {
                            data && data.data.map((jobId: any, index: number) => <AppliedJob key={index} id={jobId.job} approved={jobId.approved} token={tokenData.token} target={target} />)
                        }
                    </div>
                </div>
            </div>
        </div>  
    </section>
  )
}

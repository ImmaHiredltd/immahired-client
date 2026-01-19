"use client"
import React, { useContext, useEffect } from 'react'
import lang from "./page.json"
import { LanguageData } from '@/app/context';
import { FaSearch } from 'react-icons/fa';
import Shorlisted from '@/components/shortlistedCandidates';
import { useGetJobsQuery } from '@/app/api/general';
import Cookies from 'js-cookie';
import { useGetEmployerQuery } from '@/app/api/features/employer';

const jsonData: any = lang;
export default function ShorlistedCandidates() {
    const languageContext = useContext(LanguageData);
    const { data, isLoading } = useGetJobsQuery(null);

    console.log(data)
    if (!languageContext) {
    throw new Error("LanguageData context is not provided!");
    }

    const [language, setLanguage] = languageContext;
    const target = jsonData[language]

    const token = Cookies.get('token');
    var tokenData;
    if(token){
      tokenData = JSON.parse(token);
    }
    const { data: empData } = useGetEmployerQuery(tokenData.data.id)

  return (
    <section className='sm:px-banner-clamp'>
        <div className='mt-10 w-full'>
            <h3 className='text-xl'>{target.short_jobs}</h3>
            <div className='w-full bg-primary shadow-xl shadow-gray-400 p-3 sm:p-8 rounded-xl mt-3 text-white space-y-8'>
                    {/* <div className='w-[40%] rounded-xl border border-main px-2 py-1 bg-white text-black flex items-center'>
                        <input placeholder={target.search} className='w-[90%] focus:outline-none' />
                        <button className='h-full w-[10%] flex items-center p-3 rounded-md text-white justify-center bg-main'>
                            <FaSearch />
                        </button>
                    </div> */}

                    <div>
                        {/* <h3 className='text-xl'>5 {target.jobs_found}</h3> */}
                        <div className='space-y-10'>
                            {
                                data && data.data.map((datum: any, index: number) => <Shorlisted target={target} key={index} job={datum} />)
                            }

                            { data && data.data.length === 0 && 
                                <div className='w-full h-[50vh] flex flex-col justify-center items-center'>
                                    {target.no_shortlisted}
                                </div>
                            }
                        </div>
                    </div>
            </div>
        </div>  
        
    </section>
  )
}

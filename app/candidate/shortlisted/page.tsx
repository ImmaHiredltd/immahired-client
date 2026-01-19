"use client"
import React, { useContext, useEffect } from 'react'
import lang from "./page.json"
import { LanguageData } from '@/app/context';
import Shorlisted from '@/components/shorlisted';
import { FaSearch } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { useGetTalentMutation } from '@/app/api/general';
import { CiBookmark } from 'react-icons/ci';
import { IoBookmark } from 'react-icons/io5';
const jsonData: any = lang;

export default function Shortlisted() {

    const languageContext = useContext(LanguageData);
    const [ submitToken, { data, isLoading } ] = useGetTalentMutation();
    if (!languageContext) {
    throw new Error("LanguageData context is not provided!");
    }

    const [language, setLanguage] = languageContext;
    const target = jsonData[language];

    const token = Cookies.get('token');
    var userData: any;
    if(token){
      userData = JSON.parse(token);
    }

    useEffect(() => {
        const talent = Cookies.get('user');
        var talentData: any;
        if(talent){
            talentData = JSON.parse(talent);
        }

        async function getSavedJobs(){
            if(talentData){
                try{
                    const res = await submitToken(talentData.data.id).unwrap()
                    console.log(await res)
                }catch(err){
                    console.error(err)
                }
            }
        }

        getSavedJobs()
    }, [])

  return (
    <section className='sm:px-banner-clamp'>
        <div className='mt-10 w-full'>
            <div className='text-2xl flex gap-3 items-center'>
                <span className='text-main text-6xl'><IoBookmark /></span>
                {target.short_jobs} 
            </div>
            <div className='w-full bg-primary shadow-xl shadow-gray-400 p-3 sm:p-8 rounded-xl mt-3 text-white space-y-8'>
                    {/* <div className='w-full md:w-[40%] max-sm:text-xs rounded-xl border border-main p-2 bg-white text-black flex items-center'>
                        <input placeholder={target.search} className='w-[90%] focus:outline-none' />
                        <button className='h-full flex items-center p-3 rounded-md text-main justify-center'>
                            <FaSearch />
                        </button>
                    </div> */}

                    {
                        isLoading && (
                            <div className='text-white'>
                                Loading...
                            </div>
                        )
                    }
                    
                    <div>
                        <h3 className='text-xl'>{!isLoading && data && data > 0 && target.jobs_found}</h3>
                        <h3 className='text-xl'>{!isLoading && data && data === 0 && 'No Jobs found!'}</h3>
                        <div>
                            {
                                data && data.data.savedJobs.map((datum: any, index: number) => <Shorlisted key={index} target={target} jobs={datum} />)
                            }
                        </div>
                    </div>
            </div>
        </div>  
    </section>
  )
}

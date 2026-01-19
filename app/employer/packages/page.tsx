"use client"
import { LanguageData } from '@/app/context';
import React, { useContext, useEffect } from 'react'
import lang from './page.json'
import langs from "@/app/employer/submit-job/page.json"
import Header from '@/components/headers';
import { useGetPackagesQuery, useGetUserMutation } from '@/app/api/general';
import Cookies from 'js-cookie';
import { FaBox } from 'react-icons/fa6';
import { PiSpinner } from 'react-icons/pi';
import Link from 'next/link';
import SubmitPackage from '@/components/submitPackage';

export default function Packages() {
  const [ submitId, { data, isLoading: dataLoading} ] = useGetUserMutation();
  const { data: packageData, isLoading } = useGetPackagesQuery(null)

  const jsonData: any = lang;
  const packData: any = langs
  const languageContext = useContext(LanguageData);
  if (!languageContext){
    throw new Error("LanguageData context is not provided!");
}
const [language, setLanguage] = languageContext;
const target = jsonData[language]
const packTarget = packData[language] 

useEffect(() => {
    const token = Cookies.get('token');
    var tokenId;
    async function getUser(id: string){
      const res = await submitId(id).unwrap();
    }
    if(token){
      tokenId = JSON.parse(token);
      getUser(tokenId.data.id);
    }
    
}, [])

// console.log(packageData)
  return (
   <>
       <section className='sm:px6'>
        {/* <Header title={target.title} /> */}
        <h2 className='text-lg sm:text-[2rem] font-semibold'>{target.title}</h2>
        <div className='bg-abstract shadow-xl shadow-gray-400 rounded-xl w-full p-5 mt-5 text-white'>
            <div className='text-lg sm:text-xl'>
              {target.sub}
            </div>

            {
              dataLoading && (
                <PiSpinner className='animate-spin text-2xl my-8' /> 
              )
            }

            {
              data && data.data.package && packageData && !dataLoading ?
                <div className='flex justify-between items-center py-5'>
                  <div className='flex gap-3 items-center'>
                    <div className='p-3 text-lg bg-white rounded-full text-abstract'>
                        <FaBox />
                    </div>
                    <div className='max-sm:text-xs max-sm:w-[70%]'>
                        <span>{target.sub_title} &quot;{data.data.package}&quot; {target.package}</span>
                    </div>
                  </div>
                  {
                    data.data.package !== "unlimited" &&
                    <div className='max-sm:text-xs max-sm:w-[30%]'>
                      {target.package_price}: ${packageData && packageData.data.Packages[data.data.type][data.data.package].price}
                    </div>
                  }
                  
                </div>
                :
                !dataLoading && !isLoading &&
                  <div className='py-5 flex flex-col gap-2'>
                    <span>{target.no_package}</span>
                    <Link href={'/package'} className='px-5 py-2 text-sm text-white rounded bg-main w-fit'>{target.sub_now}</Link>
                  </div>
            }
           
        </div>
       </section>
        <div className='mt-10'>{" "}</div>
       <SubmitPackage target={packTarget} />
   </>
  )
}

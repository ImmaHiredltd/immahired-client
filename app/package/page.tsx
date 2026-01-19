"use client"
import Navbar from '@/components/nav'
import React, { useContext, useEffect } from 'react'
import { useGetPackagesQuery, useGetUserMutation, useUpGradePackageMutation } from '../api/general';
import Header from '@/components/headers';
import { LanguageData } from '../context';
import lang from '@/app/employer/submit-job/page.json'
import Cookies from 'js-cookie';
import Packages from '@/components/packages';
import Footer from '@/components/footer';
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function Package(){    
    const [ submitId ] = useGetUserMutation();
    const { data: packageData, isLoading: packageLoading, isError } = useGetPackagesQuery(null)

    const languageContext = useContext(LanguageData);
    const jsonData: any = lang;

    if (!languageContext){
        throw new Error("LanguageData context is not provided!");
    }
    const [language, setLanguage] = languageContext;
    const target = jsonData[language]

    useEffect(() => {
        const token = Cookies.get('token');
        var tokenId;
        async function getUser(id: string){
            try{
                const res = await submitId(id).unwrap();
            }catch(err){
                console.error(err)
            }
        }
        if(token){
            tokenId = JSON.parse(token)
            getUser(tokenId.data.id);
        }
    }, [])


  return (
    <section className='w-full'>
        <Navbar isScrolled = {true} />
        <ToastContainer />
        <section className='py-28 sm:py-36 px-banner-clamp space-y-10'>
            {/* <Header title={target.package} /> */}
            {isError && (
                <div className='w-full h-[50vh] flex flex-col justify-center items-center'>

                    {/* oops gif */}
                    <img src="/images/wired-outline-1140-error-hover-enlarge.gif" alt="Oops!" className="" />

                    <h2 className='text-red-500 font-semibold sm:w-1/2 text-center'>{target.warning}</h2>
                    

                </div>
            )}
                    <div className='space-y-12 sm:space-y-8'>
                        {   
                            packageData && (
                                <>
                                    <Tabs defaultValue="candidates" className=" sm:border-2 sm:px-5 mt-5 pb-10 rounded-2xl border-gray-100">
                                        <TabsList className='w-full sm:w-1/2 mx-auto flex justify-center -translate-y-[50%] '>
                                            <TabsTrigger value="candidates" className='px-5 py-2 font-semibold '>Candidates</TabsTrigger>
                                            <TabsTrigger value="employers" className='px-5 py-2 font-semibold'>Employers</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="candidates">
                                            <div className='space-y-2 mt-8'>
                                                {/* <h2 className='font-semibold'>{target.for_candidates}:</h2> */}
                                                <div className='flex gap-5 flex-wrap'>
                                                    {packageData && packageData.data.TALENT_PACKAGE.map((datum: any, index: number) => <Packages key={index} target={target} plan={packageData.data.Packages.talent[datum]} packType={datum} role={'talent'} />)}
                                                </div>
                                            </div> 
                                        </TabsContent>
                                        <TabsContent value="employers">
                                            <div className='space-y-2 mt-8'>
                                                {/* <h2 className='font-semibold'>{target.for_employers}:</h2> */}
                                                <div className='flex gap-5 flex-wrap'>
                                                    {packageData && packageData.data.EMPLOYER_PACKAGE.map((datum: any, index: number) => <Packages key={index} target={target} plan={packageData.data.Packages.employer[datum]} packType={datum} role={'employer'} isPromotional={datum == 'promotional'} />)}
                                                </div>
                                            </div>  
                                        </TabsContent>
                                    </Tabs>

                                </>       
                            )   
                        } 

                        {
                            packageLoading && (
                                <section className='w-full h-[80lvh] top-0 z-50 flex items-center justify-center'>
                                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                                </section>
                            )
                        }              
                    </div>
        </section>
        <Footer />
    </section>
  )
}

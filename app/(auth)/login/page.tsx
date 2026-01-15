"use client"
import React, { useContext, useEffect, useState } from 'react'
import lang from "@/app/(auth)/page.json"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageData } from '@/app/context';
import Header from '@/components/headers';
import { FaRegUser, FaToolbox } from 'react-icons/fa';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import Link from 'next/link';
import Navbar from '@/components/nav';
import Footer from '@/components/footer';
import { useGetTalentMutation, useGetUserMutation, useLoginMutation } from '@/app/api/general';
import { PiSpinner } from 'react-icons/pi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { UserData } from '@/app/tokenContext';
import Cookies from 'js-cookie'


const jsonData: any = lang;

export default function Login() {
    const languageContext = useContext(LanguageData);
    const [showPassword, setShowPassword] = useState(false)

    if (!languageContext) {
        throw new Error("LanguageData context is not provided!");
    }

    const [language, setLanguage] = languageContext;
    const target: any = jsonData[language];

    const route = useRouter();

    const [submitData, { isLoading, isError, error, data, isSuccess }] = useLoginMutation<any>();
    const [ submitToken, { data: talentData, isLoading:talentLoading } ] = useGetTalentMutation();
    const [ submitUserToken, { data: userData, isLoading: userLoading } ] = useGetUserMutation();


    const [active, setActive] = useContext(UserData);

    // Data control for candidate
    const [candidateData, setCandidateData] = useState({
        email: '',
        password: ''
    })

    const validataUserType = async (id: any) => {
        try{
            const user = await submitUserToken(id).unwrap();
            if(await user){
                Cookies.set('user', JSON.stringify(user), { expires: 1 })
                if(user.data.type === 'talent'){
                    return 'talent'
                }else if(user.data.type === 'employer'){
                    return 'employer'
                }else if(user.data.type === 'admin'){
                    return 'admin'
                }
            }
        }catch(err: any){
            console.error(err.code)
        }
    }

    const candidateChange = (e: any) => {
        e.preventDefault();
        const {name, value} = e.target;
        setCandidateData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const candidateSubmit = async (e: any) => {
        e.preventDefault();
        if(validateEmail(candidateData.email)){
            try{
                const res = await submitData(candidateData).unwrap();
                if(await res){
                    console.log(res)
                    Cookies.set('token', JSON.stringify(res), { expires: 1 })
                    try{
                        if(await validataUserType(res.data.id) === "talent"){
                            toast('Logged in as a Candidate!')
                            const talent = await submitToken(res.data.id).unwrap();
                            if(await talent){
                                Cookies.set('talent', JSON.stringify(talent), { expires: 1 })
                            }
                            route.push('/')
                            setActive(true)
                        }
                        if(await validataUserType(res.data.id) === "employer"){
                            toast('Logged in as an Employer!')
                            route.push('/')
                            setActive(true)
                        }
                        if(await validataUserType(res.data.id) === 'admin'){
                            toast('Logged in as an Admin!')
                            setActive(true)

                            if(res.data.approved === false){
                                route.push('/')
                            }else{  
                                route.push('/admin')
                            }
                        }
                    }catch(err){
                        console.error(err)
                    }
                }
            }catch(err){
                console.error(err)
            }
        }
    }
    
  return (
   <>
        <Navbar isScrolled = {true} />
         <section className='h-[100svh] [@media(min-width:2000px)]:max-w-[2300px] [@media(min-width:2000px)]:h-[1000px] mx-auto w-screen flex items-center justify-center'>
         <ToastContainer />
        <div className='w-[85%] sm:w-1/3 lg:w-1/4 space-y-10'>
            {/* <Header title={target.login_header} /> */}
                    <form onSubmit={candidateSubmit}>
                        <h2 className='text-2xl font-bold mb-3'>{target.login_header}</h2>
                        <div className='space-y-5'>
                            {   isError && 
                                <div className='p-3 bg-red-600 text-white rounded-md text-sm text-center'>{error?.data?.message || 'Error occured! Try again'}</div>
                            }
                            <input type='email' onChange={candidateChange} name='email' required placeholder={target.email} className='w-full p-2 rounded-md border-2 border-main' />

                            <div className='w-full relative h-5'>
                                <input onChange={candidateChange} name='password' placeholder={target.password} type={`${showPassword ? "text" : "password"}`} className=' p-2 rounded-md  w-full border-2 border-main absolute  z-10 pr-10' />
                                <div onClick={() => setShowPassword(!showPassword)} className='absolute z-20 right-3 hover:cursor-pointer h-10 flex items-center'>
                                    {
                                        showPassword ? <IoEyeOff  className='text-2xl text-gray-500' /> : <IoEye className='text-2xl text-gray-500' />
                                    }    
                                </div>
                            </div>

                            <Link href='/forgot' className='text-xs pt-5 flex font-semibold items-center gap-3 justify-end'>
                                {target.forgotten_password}
                            </Link>

                            <div className='pt-5'>
                                <button disabled={isLoading} className='w-full flex justify-center p-2 bg-main rounded-md text-white'>
                                    {isLoading ? <PiSpinner className='animate-spin text-2xl ' /> : target.login}
                                </button>
                            </div>
                        </div>
                    </form>
        </div>
    </section>
    <Footer />
   </>
  )
}

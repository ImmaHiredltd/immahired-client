"use client"
import { LanguageData } from '@/app/context'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { usePathname } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import logo from "@/public/images/logo.png"
import ReactFlagsSelect, { Us } from 'react-flags-select'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { RxCaretDown } from "react-icons/rx";
import { IoEarthSharp } from 'react-icons/io5'
import { AiOutlineMenu } from 'react-icons/ai'
import Image from 'next/image'
import navLanguage from "@/app/page.json"
import Token, { UserData } from '@/app/tokenContext'
import { TiThMenu, TiTimes } from 'react-icons/ti'
import SideNav from './sideNav'
import { useRouter } from 'next/navigation'
import {motion} from 'framer-motion'

export type Navs = {
    id: number,
    name: string,
    ref: string
  }
  

  const jsonData : any = navLanguage;
  
  
  const AuthButton = ({label,refs, className}: {label: string, refs: string, className: string}) => {
    return <Link className={` ${className} px-5 py-2 rounded-md text-sm`} href={`${refs}`}>{label}</Link>
  }
  
export default function Navbar({ isScrolled }: { isScrolled: boolean }){
    const pathName = usePathname()
    const languageContext = useContext(LanguageData); 
    const [moblieNavInview, setMobileNavInview] = useState(false)
    const route = useRouter()
    const [isUltraWide, setIsUltraWide] = useState(false);
    
    useEffect(() => {
    const check = () => {
      setIsUltraWide(window.innerWidth >= 2000);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  
    if (!languageContext) {
      throw new Error('Navbar must be used within a LanguageProvider');
    }
    const [language, setLanguage] = languageContext;
    const [transLanguage, setTransLanguage] = useState('English');
    const target = jsonData[language]

    // User's authentication
    const [active, setActive] = useContext(UserData);

    const token = Cookies.get('token');
    var tokenData: any;
    if(token){
      tokenData = JSON.parse(token);
    }

    const navs: Navs[] = [
      {
        id: 1,
        name: target.home,
        ref: "/"
      },
      {
        id: 2,
        name: target.jobs,
        ref: '/jobs'
      },
      {
        id: 7,
        name: target.candidates,
        ref: '/candidates'
      },
      {
        id: 3,
        name: target.service,
        ref: '/services'
      },
      {
        id: 4,
        name: target.package,
        ref: '/package'
      }
    ]
  
    const handleChange = (e: any) => {
      console.log(e);
      if(localStorage){
        if(e === 'GB'){
          setLanguage('en');
          localStorage.setItem('language', 'en')
          // setTransLanguage('English')
        }
        if(e === 'ES'){
          setLanguage('es');
          localStorage.setItem('language', 'es')
          // setTransLanguage('Spanish')
        }
        if(e === 'CN'){
          setLanguage('cn');
          localStorage.setItem('language', 'cn')
          // setTransLanguage('Chinese')
        }
      }
    }

    const logout = (e: any) => {
      e.preventDefault();
      setActive(false);
      Cookies.remove('token');
    }
    // console.log("Active:", tokenData)
  return (
    <>
    <motion.nav
  initial="top"
  animate={isScrolled ? "scrolled" : "top"}
  variants={{
    top: {
      width: isUltraWide ? "2300px" : "95%",
      borderRadius: "9999px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      borderColor: "rgba(0,0,0,0.08)",
      marginTop: "20px",
    },
    scrolled: {
      width: isUltraWide ? "2300px" : "100%",
      borderRadius: "0px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
      borderColor: "transparent",
      marginTop: "0px",
    },
  }}
  transition={{
    duration: 0.35,
    ease: "easeOut",
  }}
  className="
    fixed top-0 left-1/2 -translate-x-1/2
    z-50
    border
    px-2 sm:px-6 lg:px-10 py-1 sm:py-4
    backdrop-blur-2xl
    bg-white/70
    flex items-center justify-between
    text-sm
  "
>

      <div className='w-[40%] relative '>
        <div onClick={() => route.push('/')} className='relative cursor-pointer  flex max-[380px]:w-[200px] max-[380px]:h-[50px] w-[263px] h-[80px] items-center text-logo font-bold'>
            <Image 
                src={logo}
                alt='logo'
                fill
                className=' object-cover'
            />
        </div>
      </div>
      <div className={`xl:flex hidden justify-between tracking-wide ${active ? ' max-w-[500px]' : ' max-w-[380px]' }  items-center xl:w-[95%] 2xl:w-[40%] font-semibold text-sm text-black`}>
      {
          navs && navs.map((data, index) => {
            const showLink = (data.id !== 7 && data.id !== 8) || // Always show links except for candidate
              (active && data.id === 7 && tokenData?.data?.type === 'employer') || // Show candidate tab for employer
              (active && data.id === 7 && tokenData?.data?.type === 'admin') // Show candidate tab for admin
            return (
              showLink && (
                <div key={index} className="flex">
                  <Link href={`${data.ref}`} className={`${pathName === data.ref ? "navLink" : ""}`}>
                    <span>{data.name.toLocaleUpperCase()}</span> 
                  </Link>
                  {data.id === 1 && (
                    <Popover>
                      <PopoverTrigger className="flex items-center">
                        <RxCaretDown className="text-xl" />
                      </PopoverTrigger>
                      <PopoverContent
                        className="
                          bg-abstract text-white
                          rounded-lg shadow-xl
                          px-4 py-3
                          flex flex-col gap-3
                          text-xs
                          border border-white/10
                        "
                      >
                        <Link href={'/about'}>{target.about}</Link>
                        <Link href={'/#story'}>{target.story}</Link>
                        <Link href={'/about#contact'}>{target.contact}</Link>
                        <Link href={'/about#founder'}>{target.founder}</Link>
                        <Link href={'/#team'}>{target.team}</Link>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              )
            );
          })
        }

      </div>
      <div className="w-[40%] xl:flex justify-end gap-3 hidden">
          <div className="flex gap-1 items-center text-sm">
              <label><IoEarthSharp /></label>
              <ReactFlagsSelect
                      selected={language}
                      countries={["GB", "CN", "ES"]}
                      onSelect={handleChange}
                      className={`menu-flags outline-none `}
                      placeholder={language}
                      showSelectedLabel={true}
                      selectButtonClassName="menu-flags-button"
                      selectedSize={10}
                      optionsSize={10}
              />

          </div>
          <div className="space-x-3">
          {
            active ?
              <div className='flex gap-2 items-center'>
                <a href={tokenData.data?.type === 'talent' ? '/candidate': tokenData.data?.type === 'admin' && tokenData.data?.approved ? '/admin' : tokenData.data?.type === 'employer' ? '/employer' : "/" } className={`${isScrolled ? 'text-white' : 'text-black'} ${tokenData.data?.type === 'admin' && !tokenData.data?.approved && 'cursor-not-allowed pointer-events-none'}  border-2 border-main bg-transparent text-sm rounded px-5 py-2`}>
                  {target.dashboard}
                </a>

                <button onClick={logout} className='text-sm rounded px-5 py-2 border-2 border-main bg-main hover:bg-red-600 hover:border-red-600  text-white'>{target.logout}</button>
              </div>
            : 
              <div className='flex gap-3'>
                <AuthButton label={target.register} refs="/register" className="border-2 border-main" />
                <AuthButton label={target.login} refs="/login" className="border-2 border-main bg-main text-white" />
              </div>
          }
          </div>
      </div>

      <div className='flex gap-2 items-center xl:hidden'>
               {
                  moblieNavInview ? 
                    <button onClick={() => setMobileNavInview(false)} className="flex xl:hidden max-[380px]:text-2xl text-4xl font-semibold items-center ">
                      <TiTimes />
                    </button>
                  :
                    <button onClick={() => setMobileNavInview(true)} className="flex xl:hidden max-[380px]:text-xl text-3xl font-semibold items-center ">
                      <TiThMenu />
                    </button>
              }
      </div>
      
     
    </motion.nav>
    {
      moblieNavInview && (
        <SideNav navs={navs} language={language} type={tokenData} target={target} handleChange={handleChange} setMobileNavInview={setMobileNavInview} />
      )
    }
    </>
  )
}

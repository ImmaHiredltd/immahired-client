"use client"
import Link from "next/link";
import React, { useContext, useState } from 'react'
import pageLanguage from "@/app/page.json"
import { LanguageData } from "@/app/context";
import Image from "next/image";
import logo from "@/public/images/logo-1-removebg-preview.png"
import Cookies from "js-cookie";
import { FaArrowRight, FaFacebookSquare, FaInstagram, FaTimes } from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";
import wechat from "@/public/images/wechat.jpg"


const jsonData: any = pageLanguage;
export default function Footer() {
    const [language, setLanguage] = useContext<any>(LanguageData);
    const [showChat, setShowChat] = useState(false)
    const target: any = jsonData[language];
    const year = new Date();

    const user = Cookies.get('user');
    var userData;
    if(user){
        userData = JSON.parse(user);
    }


  return (
    <section className='w-full text-sm max-[380px]:text-xs bg-main text-white px-8 py-10 sm:py-32 space-y-12'>
        {
            showChat && (
                <div className="fixed w-screen h-screen top-0 left-0 bg-black/60 z-50 flex justify-center items-center">
                    <div className="p-10 rounded bg-white relative">
                        <button onClick={() => setShowChat(false)} className="text-red-500 text-xl absolute right-5 top-5"><FaTimes /></button>
                        <h2 className="text-black text-xl font-semibold text-center">{target.scan}</h2>
                        <Image 
                            alt="Wechat qr code"
                            src={wechat}
                            width={300}
                            height={400}
                            className=""
                        />
                    </div>
                </div>
            )
        }
        <div className="flex sm:flex-row flex-col gap-5">
            <div className="w-full sm:w-[30%] lg:px-16">
                <div className="font-bold text-xl w-[150px] -translate-y-7 h-[150px] lg:w-[170px] lg:h-[170px] relative">
                    <Image 
                        src={logo}
                        alt={'Logo'}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
            <div className="space-y-5 w-full sm:w-[16%]">
                <h1 className='font-semibold'>{target.footer_one_title}</h1>
                <span className="flex flex-col gap-3">
                    <Link href='/jobs'>{target.footer_one_link1}</Link>
                </span>
                <span className="flex flex-col gap-3">
                    <Link href={userData && userData.data.type === 'talent' ? '/candidate' : '/login'}>{target.footer_one_link2}</Link>
                </span>
                <span className="flex flex-col gap-3">
                    <Link href='/#team'>{target.our_team}</Link>
                </span>
                <span className="flex flex-col gap-3">
                    <Link href='/about#contact'>{target.contact_1}</Link>
                </span>
            </div>
            <div className="space-y-5 w-full sm:w-[16%]">
                <h1 className='font-semibold'>{target.footer_two_title}</h1>
                <span className="flex flex-col gap-3">
                    <Link href={userData && userData.data.type === 'employer' ? '/employer' : '/login'}>{target.footer_two_link2}</Link>
                    <Link href={userData && userData.data.type === 'employer' ? '/employer/submit-job' : '/login'}>{target.footer_two_link3}</Link>
                    <span className="flex flex-col gap-3">
                    <Link href='/jobs'>{target.find_talents}</Link>
                    <Link href='/#team'>{target.our_team}</Link>
                    <Link href='/about#contact'>{target.contact_1}</Link>
                </span>
                </span>
            </div>
            <div className="space-y-5 w-full sm:w-[16%]">
                <h1 className='font-semibold'>{target.footer_three_title}</h1>
                <span className="flex flex-col gap-3">
                    <Link href='/about'>{target.footer_three_title_1}</Link>
                    <Link href='/terms'>{target.footer_three_link1}</Link>
                    <Link href='/package'>{target.footer_three_link2}</Link>
                    <Link href='/#testimonials'>{target.testimonials}</Link>
                    <Link href='/#team'>{target.our_team}</Link>
                    {/* <Link href='/about#contact'>{target.contact_1}</Link> */}

                </span>
            </div>
            <div className="space-y-5 w-full sm:w-[20%]">
                <Link href={'/about/#contact'} className='font-semibold flex items-center gap-2'>{target.footer_four_title} <FaArrowRight /></Link>
            </div>
        </div>

        <div className="flex justify-center gap-3 text-2xl">
            <Link href={'https://www.facebook.com/imma.hire'} className="hover:scale-110 transition-transform transform duration-300">
                <FaFacebookSquare />
            </Link>
            <Link href={'https://www.instagram.com/immahired/'} className="hover:scale-110 transition-transform transform duration-300">
                <FaInstagram />
            </Link>
            <button onClick={() => setShowChat(true)} className="hover:scale-110 transition-transform transform duration-300">
                <IoLogoWechat />
            </button>
        </div>

        <div className="text-xs flex justify-center items-center sm:flex-row flex-col gap-3">
            <span>&copy; {year.getFullYear()} Immahired. All rights reserved</span>
            <span>苏 ICP 备 2024148674 号</span>
        </div>
        
    </section>
  )
}
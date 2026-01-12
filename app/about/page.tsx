"use client"
import SideImage from '@/components/sideImage'
import React, { useContext, useState } from 'react'
import parse from 'html-react-parser';
import aboutLanguage from '@/app/about/about.json'
import { LanguageData } from '../context'
import Footer from '@/components/footer'
import Navbar from '@/components/nav'
import { motion } from "framer-motion"
import Image from 'next/image'
import Link from 'next/link';
import { FaFacebookSquare, FaInstagram, FaTimes } from 'react-icons/fa';
import { IoLogoWechat } from 'react-icons/io5';
import wechat from "@/public/images/wechat.jpg"
import ContactSection from '@/components/contact';
import Founder from '@/components/founder';
import { useMediaQuery } from 'react-responsive';

type LanguageContextType = [string, (language: string) => void];
export default function About() {
    const languageContext = useContext(LanguageData);
    const jsonData: any = aboutLanguage;
    const [showChat, setShowChat] = useState(false);
    const isMobileWidth = useMediaQuery({ minWidth: 414 });
    const isMobileHeight = useMediaQuery({ maxHeight: 700 });

    if (!languageContext) {
        throw new Error("LanguageData context is not provided!");
    }
    const [language, setLanguage] = languageContext;
    const target:any = jsonData[language]

  return (
    <section id='about' className='w-full overflow-x-hidden'>
        <Navbar isScrolled = {true} />
        
        <div className={`${isMobileHeight && isMobileWidth ? "pt-32" : "pt-44"} flex flex-col items-center gap-3 max-[380px]:pt-32`}>
            <h2 className='sm:text-4xl text-2xl font-black'>About</h2>
            <h5>
                <a href="/" className='hover:text-blue-600 max-[380px]:text-sm'>Home</a> /
                <span> About</span>
            </h5>
        </div>

        <div className={`w-screen h-fit sm:h-screen flex  max-[380px]:p-3 p-5 sm:p-12 justify-evenly`}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 max-[380px]:gap-2 gap-5 sm:gap-20 items-center">
                {/* Image Mosaic */}
                <div className="relative grid grid-cols-2 max-[380px]:gap-3 gap-6">
                    {/* Image 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="relative h-[200px] sm:h-[220px] rounded-2xl overflow-hidden shadow-xl"
                    >
                        <Image src="/images/pexels-divinetechygirl-1181406.jpg" alt="About 1" fill className="object-cover" />
                    </motion.div>

                    {/* Image 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="relative h-[260px] sm:h-[280px] rounded-2xl overflow-hidden shadow-xl"
                    >
                        <Image src="/images/pexels-august-de-richelieu-4427815.jpg" alt="About 2" fill className="object-cover" />
                    </motion.div>

                    {/* Image 3 */}
                    <motion.div
                        initial={{ opacity: 0, x: -30, y: 0 }}
                        whileInView={{ opacity: 1, x: 0 , y:-60}}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        viewport={{ once: true }}
                        className="relative h-[260px] sm:h-[280px] rounded-2xl overflow-hidden shadow-xl"
                    >
                        <Image src="/images/pexels-jopwell-2422280.jpg" alt="About 3" fill className="object-cover" />
                    </motion.div>

                    {/* Image 4 */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative h-[200px] sm:h-[220px] rounded-2xl overflow-hidden shadow-xl"
                    >
                        <Image src="/images/Frame 269.png" alt="About 4" fill className="object-cover" />
                    </motion.div>
                </div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                <h2 className="text-2xl max-[380px]:text-xl sm:text-xl text-main font-extrabold tracking-tight">
                    {target.about}
                </h2>

                <div className={`max-[380px]:text-sm ${isMobileHeight && isMobileWidth && "text-sm"}`}>
                    {parse(target.details)}
                </div>
                </motion.div>

            </div>
        </div>

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

        <Founder isMobileWidth isMobileHeight />

        <ContactSection target={target} setShowChat={() => setShowChat(!showChat)} />
        
        <Footer />
    </section>
  )
}

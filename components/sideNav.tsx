"use client"
import { UserData } from '@/app/tokenContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import ReactFlagsSelect from 'react-flags-select'
import { useMediaQuery } from 'react-responsive'

export default function SideNav({ navs, target, setMobileNavInview, language, handleChange }: any) {
    const [active, setActive] = useContext(UserData)
    const pathName = usePathname();
    const [ hash, setHash ] = useState('');

    useEffect(() => {
        setHash(
            window.location.hash
        )
    })

    const token = Cookies.get('token');
    var tokenData: any;
    if (token) {
        tokenData = JSON.parse(token);
    }

    const isMobile = useMediaQuery({ maxWidth: 640 });
    const isMobileWidth = useMediaQuery({ minWidth: 414 });
    const isMobileHeight = useMediaQuery({ maxHeight: 700 });


    const logout = (e: any) => {
        e.preventDefault();
        setActive(false);
        Cookies.remove('token');
        window.location.href = '/';
    }

    return (
        <section className={`${isMobileHeight && isMobileWidth && "text-[10px]"} w-screen h-screen max-[380px]:text-[10px] text-xs fixed flex justify-end z-40`}>
            <div className={`${isMobileHeight && isMobileWidth && "pt-28"} w-full max-w-[500px] h-screen bg-white px-10 max-[380px]:pt-28 pt-36 relative`}>
                {
                    navs && navs.map((data: any, index: number) => {
                        const showLink = (data?.id !== 7 && data?.id !== 8) || // Always show links except for candidate/employer
                            (active && data?.id === 7 && tokenData.data.type === 'employer' || tokenData?.data.type === 'admin') || // Show candidate tab for employer
                            (active && data?.id === 8 && tokenData?.data.type === 'talent'); // Show employer tab for candidate
                        return (
                            <>
                                {
                                    showLink && (

                                        <div key={index} className='flex flex-col'>
                                            <Link href={`${data.ref}`} className={` ${isMobileHeight && isMobileWidth ? "p-4" : "p-5"} max-[380px]:p-3 rounded-l-full ${pathName === data.ref ? "bg-abstract text-white" : ""}`}>
                                                <span>{data.name.toLocaleUpperCase()}</span>
                                            </Link>
                                            {
                                                data.id === 1 && (
                                                    <>
                                                        <Link onClick={() => setMobileNavInview(false)} className={`${pathName === '/about' ? "bg-abstract text-white" : ""} max-[380px]:p-3 ${isMobileHeight && isMobileWidth ? "p-4" : "p-5"} rounded-l-full`} href={'/about'}>{target.about}</Link>
                                                        <Link onClick={() => setMobileNavInview(false)} className={`${pathName+hash === '/#story' ? "font-black text-main" : ""} max-[380px]:p-3 ${isMobileHeight && isMobileWidth ? "p-4" : "p-5"} rounded-l-full`} href={'/#story'}>{target.story}</Link>
                                                        <Link onClick={() => setMobileNavInview(false)} className={`max-[380px]:p-3 ${isMobileHeight && isMobileWidth ? "p-4" : "p-5"} rounded-l-full ${pathName+hash === '/#team' ? " text-main font-black" : ""}`} href={'/#team'}>{target.team}</Link>
                                                        <Link onClick={() => setMobileNavInview(false)} className={`max-[380px]:p-3 ${isMobileHeight && isMobileWidth ? "p-4" : "p-5"} rounded-l-full ${pathName+hash === '/about#founder' ? "font-black text-main" : ""}`} href={'/about#founder'}>{target.founder}</Link>
                                                    </>
                                                )
                                            }
                                        </div>
                                    )}
                            </>

                        )
                    })
                }

                {
                    active ?
                        <>
                            <div className='flex flex-col'>
                                <Link href={tokenData.data.type === 'talent' ? '/candidate' : tokenData.data.type === 'admin' && tokenData.data.approved ? '/admin' : tokenData.data.type === 'employer' ? '/employer' : "/"} className={`max-[380px]:p-3 ${isMobileHeight && isMobileWidth ? "p-4" : "p-5"} rounded-l-full  ${tokenData.data.type === 'admin' && !tokenData.data.approved && 'cursor-not-allowed pointer-events-none'}`}>
                                    <span>{target.dashboard.toLocaleUpperCase()}</span>
                                </Link>
                                <button onClick={logout} className={`max-[380px]:p-3 ${isMobileHeight && isMobileWidth ? "p-4" : "p-5"} rounded-l-full text-left`}>
                                    <span>{target.logout.toLocaleUpperCase()}</span>
                                </button>
                            </div>
                        </> :
                        <>
                            <div className='flex flex-col'>
                                <Link href={`/register`} className={`max-[380px]:p-3 ${isMobileHeight && isMobileWidth ? "p-4" : "p-5"} rounded-l-full`}>
                                    <span>{target.register.toLocaleUpperCase()}</span>
                                </Link>
                                <Link href={`/login`} className={`max-[380px]:p-3 ${isMobileHeight && isMobileWidth ? "p-4" : "p-5"} rounded-l-full`}>
                                    <span>{target.login.toLocaleUpperCase()}</span>
                                </Link>
                            </div>
                        </>

                }
                <div className="absolute bottom-1/2 right-0 z-50 flex justify-between items-center pt-4">
                    <ReactFlagsSelect
                        selected={language}
                        countries={["GB", "CN", "ES"]}
                        onSelect={handleChange}
                        className={`menu-flags outline-none w-fit bg-white`}
                        placeholder={language}
                        showSelectedLabel={true}
                        selectButtonClassName="menu-flags-button"
                        selectedSize={10}
                        optionsSize={isMobile ? 12 : 14}
                    />
                </div>
            </div>
        </section>
    )
}

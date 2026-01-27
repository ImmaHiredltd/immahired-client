"use client"
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import pp from '@/public/images/no-image.jpg'
import { IoEarthSharp, IoLogOutOutline } from 'react-icons/io5'
import { LanguageData } from '@/app/context';
import navLanguage from "@/app/candidate/page.json"
import { IconType } from 'react-icons/lib'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { MdOutlineDashboard, MdVerified } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { TiDocumentText } from "react-icons/ti";
import { FaRegBell } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { LuMessagesSquare } from "react-icons/lu";
import { RiLockPasswordLine } from "react-icons/ri";
import Cookies from 'js-cookie'
import { useGetMeQuery, useGetUserMutation } from '@/app/api/general'
import { UserData } from '@/app/tokenContext'
import { FaBoxesStacked } from 'react-icons/fa6'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'

export type Navs = {
    id: number,
    name: string,
    ref: string,
    icon: IconType
}
export default function CanNav({ inView, onSlideIn }: { inView: boolean; onSlideIn: () => void }) {
  const token = Cookies.get("token");
  let tokenData: any;
  if (token) {
    tokenData = JSON.parse(token);
  }
  const jsonData: any = navLanguage;
  const languageContext = useContext(LanguageData);
  const pathName = usePathname();
  const { data: userData, isLoading: userLoading } = useGetMeQuery(tokenData?.data?.id);

  const route = useRouter();
  const [userInfo, setUserInfo] = useState({
    name: tokenData?.data?.name,
    lastName: tokenData?.data?.lastName,
    email: tokenData?.data?.email,
    image: tokenData?.data?.profileImage?.url,
  });

  if (!languageContext) {
    throw new Error("Navbar must be used within a LanguageProvider");
  }

  const [language, setLanguage] = languageContext;
  const target = jsonData[language];

  const handleChange = (e: any) => {
    console.log(e.target.value);
    setLanguage(e.target.value);
    if (localStorage) {
      localStorage.setItem("locale", e.target.value);
    }
  };

  useEffect(() => {
    if (userData) {
      setUserInfo({
        name: userData.data.name,
        lastName: userData.data.lastName,
        image: userData.data.profileImage.url,
        email: userData.data.email,
      });
    }
  }, [userData]);

  const navs: Navs[] = [
    {
      id: 1,
      name: target.user_dashboard,
      ref: "/candidate",
      icon: MdOutlineDashboard,
    },
    {
      id: 2,
      name: target.profile,
      ref: "/candidate/profile",
      icon: FaRegUser,
    },
    {
      id: 3,
      name: target.my_resume,
      ref: "/candidate/resume",
      icon: TiDocumentText,
    },
    {
      id: 4,
      name: target.my_applied,
      ref: "/candidate/applied",
      icon: FaRegBell,
    },
    {
      id: 5,
      name: target.short_jobs,
      ref: "/candidate/shortlisted",
      icon: CiBookmark,
    },
    {
      id: 8,
      name: target.messages,
      ref: "/candidate/messages",
      icon: LuMessagesSquare,
    },
    {
      id: 12,
      ref: "/candidate/packages",
      icon: FaBoxesStacked,
      name: target.packages,
    },
    {
      id: 10,
      name: target.change_pass,
      ref: "/candidate/change",
      icon: RiLockPasswordLine,
    },
  ];

  const [active, setActive] = useContext(UserData);
  const logout = (e: any) => {
    e.preventDefault();
    setActive(false);
    Cookies.remove("token");
  };

  // JSX return statement
  return (
    <section
      className={`w-[70vw] z-50 lg:w-[20vw] md:w-[40%] bg-primary h-screen p-5 flex flex-col justify-between xl:relative text-white absolute xl:translate-x-0 ${
        !inView && "-translate-x-[200%] transition-all"
      }`}
    >
      <div>
        <div className="w-full h-[65px] flex gap-2 text-white">
          <div className="w-[25%] h-full bg-gray-100 overflow-hidden rounded-full relative border-2 border-gray-300">
            {userInfo.image ? (
              <Image
                alt="Profile Image"
                src={userData?.data.profileImage.url}
                fill
                className="object-cover"
              />
            ) : (
              <Image alt="Profile Image" src={pp} fill className="object-cover" />
            )}
          </div>
          <div className="flex flex-col justify-evenly">
            {userData && (
              <>
                <span className="font-semibold tracking-wide text-sm flex items-center gap-2">
                  {userInfo.lastName} {userInfo.name} {tokenData?.data.approved && <MdVerified />}
                </span>
                <span className="text-sm">{userInfo.email}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        {navs.map((nav: Navs, index: number) => (
          <Link
            key={index}
            onClick={onSlideIn}
            href={nav.ref}
            className={`${
              pathName === nav.ref ? "bg-main" : ""
            } flex items-center gap-3 px-2 py-3 rounded-lg`}
          >
            <nav.icon className="text-lg" />
            {nav.name}
          </Link>
        ))}
      </div>

      <button onClick={logout} className="flex items-center gap-3 px-2 text-sm">
        <IoLogOutOutline className="text-lg" />
        <span>{target.logout}</span>
      </button>
    </section>
  );
}

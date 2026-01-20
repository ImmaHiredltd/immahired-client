"use client"
import { useGetMeQuery } from '@/app/api/general'
import React from 'react'
import pp from '@/public/images/no-image.jpg'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdVerified } from 'react-icons/md';
import { toast } from 'react-toastify';
import { IoLocation } from 'react-icons/io5';
import { BriefcaseIcon, ChevronRightIcon } from 'lucide-react';


export default function EachCandidate({ candidate, search, me}: any) {
    const { data, isLoading } = useGetMeQuery(candidate?.user);
    const { category, location, keyword } = search;
    const route = useRouter()
    const handleClick = () => {
        if(localStorage){
            localStorage.setItem('viewCandidate', JSON.stringify(data));
            localStorage.setItem('candidateTalent', JSON.stringify(candidate));
            route.push('/candidates/candidate-details')
        }
    }

    const handleAdminClick = () => {
        if(localStorage){
            if(!me.data.approved){
                toast('Cannot perform action! Account not approved');
            }else{
                localStorage.setItem('candidateTalent', JSON.stringify(candidate));
                localStorage.setItem('userData', JSON.stringify(data.data));
                route.push('/admin/details')
            }
           
        }
    }
    function truncateText(text: string | undefined, maxLength: number) {
        return text && text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    }

            // Filter checks based on `category`, `location`, and `keyword`
        const matchesCategory = !category ||  data?.data.jobCategory && data?.data.jobCategory.toLowerCase().includes(category.toLowerCase());

        const matchesLocation = !location || data?.data.location && data?.data.location.toLowerCase().includes(location.toLowerCase());
        const matchesKeyword = !keyword || data?.data.name && data?.data.name.toLowerCase().includes(keyword.toLowerCase()) || data?.data.location && data?.data.location.toLowerCase().includes(keyword.toLowerCase()) || data?.data.lastName && data?.data.lastName.toLowerCase().includes(keyword.toLowerCase()) || data?.data.jobCategory && data?.data.jobCategory.toLowerCase().includes(keyword.toLowerCase());

  return (
        matchesCategory && matchesLocation && matchesKeyword && (
            <button
                onClick={me.data.type === "admin" ? handleAdminClick : handleClick}
                className="
                    group w-full max-sm:max-w-[360px]
                    rounded-xl bg-white p-4 hover:bg-gray-100
                    shadow-xl hover:shadow-lg
                    transition-all duration-300
                    flex gap-4 items-start hover:btn-sweep
                "
                >
                {/* AVATAR */}
                <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden ring-2 ring-gray-100">
                    <Image
                    src={data?.data.image?.url || pp}
                    alt={data?.data.image?.name || "Candidate image"}
                    fill
                    className="object-cover"
                    />
                </div>

                {/* CONTENT */}
                <div className="flex-1 space-y-1 text-left">
                    {/* NAME + VERIFIED */}
                    <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-900 truncate">
                        {data?.data.lastName} {data?.data.name}
                    </h2>

                    {data?.data.approved && (
                        <span className="text-blue-500 text-sm">
                        <MdVerified />
                        </span>
                    )}
                    </div>

                    {/* LOCATION */}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                    <IoLocation className="text-gray-400" />
                    <span className="truncate">
                        {data?.data.location || "N/A"}
                    </span>
                    </div>

                    {/* CATEGORY */}
                    
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                        <BriefcaseIcon className="h-3 w-3 text-gray-400" />
                        {truncateText(data?.data.jobCategory, 22) || "N/A"}
                    </div>

                    {/* DESCRIPTION */}
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {data?.data.description
                        ? truncateText(data.data.description, 90)
                        : "No description available"}
                    </p>
                </div>

                {/* CTA ICON */}
                <div className="self-center text-gray-400 group-hover:text-main transition">
                    <ChevronRightIcon className="h-4 w-4" />
                </div>
            </button>

        )
  )
}

"use client"
import React, { useEffect, useState } from 'react'
import { UserData } from '@/app/admin/candidates/page'
import { useGetMeQuery } from '@/app/api/general'
import Image from 'next/image'
import pp from '@/public/images/no-image.jpg'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { FaTrash } from 'react-icons/fa'

export type User = {
    "id": string,
    "createdAt": string,
    "updatedAt": string,
    "name": string,
    "lastName": string,
    "phoneNumber": string,
    "location": string,
    "gender": string,
    "email": string,
    "profileImage": any, // Add this field for the new profile image
    "type": string,
    "approved": boolean,
    "package": string,
    "subscribed": boolean,
    "verified": boolean
}

interface AllCandidatesProps {
    info: UserData;
    search: {
        category: string;
        keyword: string;
        location: string;
    };
    onDelete?: (candidate: UserData) => void;
}

export default function AllCandidates({ info, search, onDelete }: AllCandidatesProps) {
    const { data, isLoading } = useGetMeQuery(info.user);
    const { category, location, keyword } = search;
    const [user, setUser] = useState<User | null>(null)
    const [imageError, setImageError] = useState(false)
    const route = useRouter()

    useEffect(() => {
        if (data) {
            setUser(data.data)
        }
    }, [data])

    const handleProfile = (e: any) => {
        e.preventDefault();
        if (localStorage) {
            localStorage.setItem('candidateTalent', JSON.stringify(info))
            localStorage.setItem('userData', JSON.stringify(user));
            route.push('/admin/details');
        }
    }

    const handleImageError = () => {
        setImageError(true);
    }

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (onDelete) {
            onDelete({
                ...info,
                user: {
                    id: user?.id,
                    name: user?.name,
                    lastName: user?.lastName,
                    email: user?.email,
                    image: user?.profileImage,
                    type: user?.type,
                    approved: user?.approved
                }
            });
        }
    }

    // Function to get the correct image source
    const getImageSrc = () => {
        if (imageError) {
            return pp; // Return default image if there's an error loading the profile image
        }

        // Check for profileImage first (new field), then fallback to image, then default
        console.log(user)
        if (user?.profileImage?.url) {
            return user.profileImage.url;
        }

        return pp; // Default image
    }

    const matchesCategory = !category || data?.data.email && data?.data.email.toLowerCase().includes(category.toLowerCase());
    const matchesLocation = !location || data?.data.approved.toString() === location;
    console.log(data?.data.approved.toString())

    return (
        matchesCategory && matchesLocation &&
        <section className='w-[90%] sm:w-[22%] h-fit min-h-[290px] mx-auto relative'>
            {/* Delete Button */}
            {onDelete && (
                <button
                    onClick={handleDeleteClick}
                    className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 group"
                    title="Delete User"
                >
                    <FaTrash className="w-3 h-3" />
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Delete User
                    </span>
                </button>
            )}

            <div className='w-full h-[350px] sm:h-[250px] relative overflow-hidden rounded-t-lg'>
                <Image
                    src={getImageSrc()}
                    alt={`${user?.name || 'Candidate'} profile image`}
                    fill
                    className='object-cover transition-transform hover:scale-105'
                    onError={handleImageError}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />

                {/* Loading state overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="text-gray-400 text-xs">Loading...</div>
                    </div>
                )}
            </div>

            <div className='flex flex-col gap-2 py-2 text-xs bg-gray-100 px-2 relative'>
                <p className={`${user?.approved ? 'bg-white text-black' : 'bg-red-500/50 text-red-500'} absolute rounded-full px-3 py-1 shadow-md shadow-gray-400 right-2 top-2 text-[10px]`}>
                    {user?.approved ? 'Approved' : 'Pending'}
                </p>
                <p className='font-semibold'>{user?.lastName} {user?.name}</p>
                <p>{user?.email}</p>
                <p className=''><span className='font-semibold'>Joined: </span>{moment(user?.createdAt).format('DD/MM/YYYY')}</p>
            </div>

            <button
                onClick={handleProfile}
                className='bg-black w-full text-white py-3 text-center rounded-b-lg text-xs hover:bg-black/70 transition-colors duration-200'
                disabled={isLoading}
            >
                {isLoading ? 'Loading...' : 'View Profile'}
            </button>
        </section>
    )
}
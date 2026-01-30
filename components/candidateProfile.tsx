"use client"
import React, { useContext, useEffect, useRef, useState } from 'react'
import Input from './input'
import Select from "react-select"
import { useEditProfileMutation } from '@/app/api/general'
import Image from 'next/image'
import pp from '@/public/images/no-image.jpg'
import { FaPen } from 'react-icons/fa6'
import Cookies from 'js-cookie'
import { useGetTalentMutation, useGetUserMutation } from '@/app/api/general'
import { PiSpinner } from 'react-icons/pi'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';



export default function ProfileForm({target, data, token, talent}:any) {
  
    const [submitProfile, { isLoading, isSuccess, isError, error }] = useEditProfileMutation();
    const [ submitToken, { data: talentData, isLoading:talentLoading } ] = useGetTalentMutation();
    const [ submitUserToken, { data: userData, isLoading: userLoading } ] = useGetUserMutation();
    const [fileObj, setFileObj] = useState()
    const [profileImage, setProfileImage] = useState<any>()
    var profileData: any = new FormData();
    const fileInputRef: any = useRef(null)

    const handleButtonClick = (e: any) => {
        e.preventDefault()
        fileInputRef.current.click(); // Trigger the hidden file input
    };

    const handleFileChange = (event: any) => {
        profileData.append('image', event.target.files[0])
        setFileObj(event.target.files[0])
    };

  const [formData, setFormData] = useState({
    lastName: data.data.lastName,
    firstName: data.data.name,
    phone: data.data.phoneNumber,
    email: data.data.email,
    image: data.data.profileImage.url,
    location: data.data.location,
    age: data.data.age,
    gender: data.data.gender,
    jobCategory: data.data.jobCategory,
    description: data.data.description,
  })


  useEffect(() => {
    async function getUsers(){
        try{
            const res = await submitToken(data.data.id).unwrap();
            const user = await submitUserToken(data.data.id).unwrap();
        }catch(err){
            console.error(err)
        }
    }
    getUsers()
  }, [])


  useEffect(() => {
        if(userData){
            console.log("userData: ", userData)
            setFormData({
                lastName: userData.data.lastName,
                firstName: userData.data.name,
                phone: userData.data.phoneNumber,
                email: userData.data.email,
                image: userData.data.profileImage.url,
                location: userData.data.location,
                age: userData.data.age,
                gender: userData.data.gender,
                jobCategory: userData.data.jobCategory,
                description: userData.data.description,
            })
        }
  }, [userData])
    const handleChange = (target: any) => {
        const {name, value} = target
        setFormData((prev: any) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleAreaChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    useEffect(() => {
        if (fileObj) {
            const imageUrl = URL.createObjectURL(fileObj);
            setProfileImage(imageUrl);
            
            // Cleanup the object URL after component unmounts or file changes
            return () => URL.revokeObjectURL(imageUrl);
        }
    }, [fileObj]);
    
    const handleProfile = async(e: any) => {
        e.preventDefault();
        profileData.append('name', formData.firstName);
        profileData.append('lastName', formData.lastName);
        profileData.append('phoneNumber', formData.phone);
        profileData.append('email', formData.email);
        profileData.append('location', formData.location);
        profileData.append('age', formData.age);
        profileData.append('description', formData.description);
        profileData.append('gender', formData.gender);
        profileData.append('jobCategory', formData.jobCategory);
        profileData.append('image', fileObj)

        try{
            const res = await submitProfile({ id: data.data.id, formData: profileData});
            if(await res){
                toast(target.user_saved);
                console.log(res)
            }
        }catch(err){
            console.error(err)
        }
    }

  return (
    <section className='mt-10'>
        <ToastContainer />
        <form onSubmit={handleProfile} method="post" className='space-y-5'>
        <div className='w-52 h-52 mt-10'>
            <div className='w-full h-full flex items-center justify-center rounded-full overflow-hidden relative shadow-md shadow-black'>
              {
                formData.image && (
                <Image
                alt='Image here..'
                src={formData.image}
                fill
                className='object-cover'
              />)
              }
              {
                profileImage && (
                    <Image
                        alt=' Image'
                        src={profileImage}
                        fill
                        className='object-cover'
                    />
                )
              }
              {
                !formData.image && !profileImage && (
                    <Image
                        alt=' Image'
                        src={pp}
                        fill
                        className='object-cover'
                    />
                )
              }
              
            </div>
            <div className='w-full flex justify-center -translate-y-4'>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} 
                />
              <button onClick={handleButtonClick} className='p-2 rounded-full bg-main text-white'>
                  <FaPen />
              </button>
            </div>
        </div>
           <div className='flex sm:flex-row flex-col gap-5 sm:gap-10'>
                <div className='w-full sm:w-[45%]'>
                    <Input label={target.last_name} name='lastName' onChange={handleChange} value={formData.lastName} />
                </div>
                <div className='w-full sm:w-[45%]'>
                    <Input label={target.first_name} name='firstName' onChange={handleChange} value={formData.firstName} />
                </div>
           </div>
           <div className='flex sm:flex-row flex-col gap-5 sm:gap-10'>
                <div className='w-full sm:w-[45%]'>
                    <Input label={target.phone_number} name='phone' onChange={handleChange} value={formData.phone} />
                </div>
                <div className='w-full sm:w-[45%]'>
                        <Input required value={formData.email} type='email' onChange={handleChange} name='email' label='Email' />
                </div>
           </div>
           <div className='flex sm:flex-row flex-col gap-5 sm:gap-10'>
                <div className='w-full sm:w-[45%]'>
                    <Input label={target.gender} name='gender' onChange={handleChange} value={formData.gender} />
                </div>
                <div className='w-full sm:w-[45%]'>
                    <Input label={target.age} name='age' onChange={handleChange} value={formData.age} />
                </div>
           </div>
           <div className='flex sm:flex-row flex-col gap-5 sm:gap-10'>
                <div className='w-full sm:w-[45%]'>
                    <Input label={target.location} name='location' onChange={handleChange} value={formData.location} />
                </div>
                <div className='w-full sm:w-[45%]'>
                    <Input label={target.jobCategory} name='jobCategory' onChange={handleChange} value={formData.jobCategory} />
                </div>
           </div>
           <div>
                <label className='block mb-2 text-sm font-black text-gray-900'>{target.description}</label>
                <textarea 
                    name='description' 
                    value={formData.description} 
                    onChange={handleAreaChange} 
                    rows={4} 
                    className='w-full sm:w-[80%] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main'
                ></textarea>
           </div>
           <button disabled={isLoading} className='rounded-md text-sm bg-main text-white px-10 py-2 w-52 flex justify-center'>{isLoading ? <PiSpinner className='animate-spin text-2xl ' /> : target.save_changes}</button>
        </form>
    </section>
  )
}

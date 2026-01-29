"use client"
import React, { useEffect, useRef, useState } from 'react'
import Input from './input'
import Image from 'next/image';
import pp from '@/public/images/no-image.jpg';
import { FaPen } from 'react-icons/fa6';
import { useEditProfileMutation, useGetUserMutation } from '@/app/api/general';
import { toast } from 'react-toastify';
import { PiSpinner } from 'react-icons/pi';
import { useUpdateEmployerMutation } from '@/app/api/features/employer';

export default function EmployerProfileForm({ target, data, user }: any) {
    const generateId = () => '_' + Math.random().toString(36).substr(2, 9);
    const [members, setmembers] = useState([{ id: generateId(), index: 1 }]);
    const [socials, setsocials] = useState([{ id: generateId(), index: 1 }]);
    const [submitProfile, { isLoading, isSuccess, isError, error }] = useEditProfileMutation();
    const [submitUserToken, { data: userData, isLoading: userLoading }] = useGetUserMutation();
    const [updateEmployer, { isLoading: empLoading }] = useUpdateEmployerMutation();
    const [fileObj, setFileObj] = useState()
    const [logoObj, setLogoObj] = useState(null) // New state for logo
    const [vidObj, setVidObj] = useState(null)
    const [vidMessage, setVidMessage] = useState('')

    const [userDetails, setUserDetails] = useState({
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        image: user.image?.url 
    });

    const [companyDetails, setCompanyDetails] = useState({
        name: data.companyName,
        overview: data.overview,
        contact: data.contactInformation,
        vid: data.shortVideo?.url,
        statement: data.equalOpportunityStatement,
        logo: data.logo?.url // Add logo to company details
    })

    var profileData: any = new FormData();
    var companyData: any = new FormData();

    const [profileImage, setProfileImage] = useState<any>()
    const [logoPreview, setLogoPreview] = useState<any>() // New state for logo preview
    const [vid, setVid] = useState<any>()

    const vidInputRef: any = useRef(null)
    const logoInputRef: any = useRef(null) // New ref for logo input

    const handleVidClick = (e: any) => {
        e.preventDefault()
        vidInputRef.current.click();
    };

    const handleVidChange = (event: any) => {
        // check file size and toast if greater than 10MB
        if(event.target.files[0]){
            const vidSizeInMB = event.target.files[0].size / (1024 * 1024);
            if(vidSizeInMB > 10) {
                toast.error("Video size should not exceed 10MB");
                return;
            }
            setVidObj(event.target.files[0]);
        }
    };

    // New function to handle logo upload
    const handleLogoClick = (e: any) => {
        e.preventDefault()
        logoInputRef.current.click();
    };

    const handleLogoChange = (event: any) => {
        setLogoObj(event.target.files[0])
    };

    const getVidObjSizeInMB = (vidObj: File) => {
        if (!vidObj) return 0;
        const sizeInBytes = vidObj.size;
        const sizeInMB = sizeInBytes / (1024 * 1024);
        return parseFloat(sizeInMB.toFixed(2));
    }

    useEffect(() => {
        if (vidObj) {
            const vidSizeInMB = getVidObjSizeInMB(vidObj);
            if (vidSizeInMB > 1) {
                setVidMessage('Video size should not exceed 1MB. Please reupload a smaller video.');
            } else {
                setVidMessage('');
            }
        }
    })

    useEffect(() => {
        async function getUsers() {
            try {
                const res = await submitUserToken(user.id).unwrap();
            } catch (err) {
                console.error(err)
            }
        }
        getUsers()
    }, [])

    useEffect(() => {
        if (userData) {
            setUserDetails({
                lastName: userData.data.lastName,
                name: userData.data.name,
                phoneNumber: userData.data.phoneNumber,
                email: userData.data.email,
                image: userData.data.profileImage?.url
            })
        }
    }, [userData])

    const fileInputRef: any = useRef(null)
    const handleButtonClick = (e: any) => {
        e.preventDefault()
        fileInputRef.current.click();
    };

    const handleFileChange = (event: any) => {
        profileData.append('image', event.target.files[0])
        setFileObj(event.target.files[0])
    };

    const handleSocialAdd = (e: any) => {
        e.preventDefault();
        setsocials((prevItems: any) => [
            ...prevItems,
            { id: generateId(), index: prevItems.length + 1 }
        ]);
    };

    const handleAdd = (e: any) => {
        e.preventDefault();
        setmembers((prevItems: any) => [
            ...prevItems,
            { id: generateId(), index: prevItems.length + 1 }
        ]);
    };
    const handleRemove = (id: any) => {
        setmembers((prevItems: any) => prevItems.filter((item: any) => item.id !== id));
    };

    useEffect(() => {
        if (fileObj) {
            const imageUrl = URL.createObjectURL(fileObj);
            setProfileImage(imageUrl);

            return () => URL.revokeObjectURL(imageUrl);
        }
    }, [fileObj]);

    // New useEffect for logo preview
    useEffect(() => {
        if (logoObj) {
            const logoUrl = URL.createObjectURL(logoObj);
            setLogoPreview(logoUrl);

            return () => URL.revokeObjectURL(logoUrl);
        }
    }, [logoObj]);

    useEffect(() => {
        if (vidObj) {
            const vidUrl = URL.createObjectURL(vidObj);
            setVid(vidUrl);

            return () => URL.revokeObjectURL(vidUrl);
        }
    }, [vidObj]);

    const handleChange = (target: any) => {
        const { name, value } = target
        setUserDetails((prev: any) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleComapanyChange = (target: any) => {
        const { name, value, type, files } = target
        setCompanyDetails((prev: any) => ({
            ...prev,
            [name]: type === 'file' ? files![0].name : value
        }));
    }

    const handleTextChange = (e: any) => {
        const { name, value } = e.target;
        setCompanyDetails(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleUserSubmit = async (e: any) => {
        e.preventDefault();
        profileData.append('name', userDetails.name);
        profileData.append('lastName', userDetails.lastName);
        profileData.append('phoneNumber', userDetails.phoneNumber);
        profileData.append('email', userDetails.email);
        if (fileObj) {
            profileData.append('image', fileObj)
        }

        try {
            const res = await submitProfile({ id: user.id, formData: profileData });
            if (await res) {
                toast(target.user_saved);
                console.log(res)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleCompanySubmit = async (e: any) => {
        e.preventDefault();
        companyData.append('companyName', companyDetails.name);
        companyData.append('overview', companyDetails.overview);
        companyData.append('contactInformation', companyDetails.contact);
        companyData.append('equalOpportunityStatement', companyDetails.statement);

        if (vidObj) {
            companyData.append('shortVideo', vidObj);
        }

        if (logoObj) {
            companyData.append('logo', logoObj);
        }

        try {
            const res = await updateEmployer(companyData).unwrap();
            if (await res) {
                toast('Updated!')
            }
        } catch (err) {
            console.error(err)
            toast.error("An error occured.")
        }
    }

    // Function to get the correct image source for profile
    const getProfileImageSrc = () => {
        if (profileImage) return profileImage;
        if (userDetails.image) return userDetails.image;
        return pp;
    }

    // Function to get the correct logo source
    const getLogoSrc = () => {
        if (logoPreview) return logoPreview;
        if (companyDetails.logo) return companyDetails.logo;
        return pp;
    }

    console.log("userData: ", userData)


    return (
        <section className='mt-10'>
            <form action="" method="post" className='space-y-8 w-full sm:w-[90%]'>
                <div className='w-52 h-52 mt-10'>
                    <div className='w-full h-full rounded-full shadow-md shadow-black/90 overflow-hidden relative'>
                        <Image
                            alt='Profile Image'
                            src={getProfileImageSrc()}
                            fill
                            className='object-cover'
                        />
                    </div>
                    <div className='w-full flex justify-center -translate-y-4'>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        <button onClick={handleButtonClick} className='p-2 rounded-full bg-main text-white'>
                            <FaPen />
                        </button>
                    </div>
                </div>
                <div className='flex sm:flex-row flex-col justify-between gap-5 sm:gap-10'>
                    <div className='w-full sm:w-[45%]'>
                        <Input label={target.last_name} name='lastName' onChange={handleChange} value={userDetails.lastName} />
                    </div>
                    <div className='w-full sm:w-[45%]'>
                        <Input label={target.first_name} name='name' value={userDetails.name} onChange={handleChange} />
                    </div>
                </div>

                <div className='flex sm:flex-row flex-col justify-between gap-5 sm:gap-10'>
                    <div className='w-full sm:w-[45%]'>
                        <Input label={target.phone_number} name='phoneNumber' value={userDetails.phoneNumber} onChange={handleChange} />
                    </div>
                    <div className='w-full sm:w-[45%]'>
                        <Input name='email' required onChange={handleChange} value={userDetails.email} type='email' label='Email' />
                    </div>
                </div>

                <button disabled={isLoading} onClick={handleUserSubmit} className='px-5 py-2 rounded bg-main text-white w-52 flex justify-center'>
                    {isLoading ? <PiSpinner className='animate-spin text-2xl ' /> : target.save}
                </button>
            </form>

            <form className='mt-10 space-y-5 w-full sm:w-[90%]'>
                <div className='text-xl font-semibold'>
                    Edit Company
                </div>
                <div className='flex justify-between gap-10 mt-5'>
                    <div className='w-full'>
                        <Input label={target.company_name} value={companyDetails.name} onChange={handleComapanyChange} name='name' />
                    </div>
                </div>

                {/* Company Logo Upload Section */}
                <div className='flex flex-col gap-1'>
                    <label htmlFor="" className='text-sm font-semibold'>Company Logo</label>
                    <div className='space-y-3'>
                        <div className='h-[200px] w-[200px] flex items-center justify-center shadow-md shadow-gray-400 rounded-xl overflow-hidden relative bg-gray-200'>
                            <Image
                                alt='Company Logo'
                                src={getLogoSrc()}
                                fill
                                className='object-cover'
                            />
                        </div>
                        <div>
                            <input
                                type="file"
                                ref={logoInputRef}
                                style={{ display: 'none' }}
                                onChange={handleLogoChange}
                                accept="image/*"
                            />
                            <button onClick={handleLogoClick} className='px-10 text-sm bg-main/50 text-main rounded w-fit py-2'>Upload Logo</button>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-1'>
                    <label htmlFor="" className='text-sm font-semibold'>{target.short_vid}</label>
                    <div className='space-y-3'>
                        <div className='h-[200px] sm:h-[400px] flex items-center justify-center w-full shadow-md shadow-gray-400 rounded-xl  overflow-hidden relative bg-gray-200'>
                            {
                                companyDetails.vid && (
                                    <video
                                        src={companyDetails.vid}
                                        controls
                                        className="absolute inset-0 object-cover w-full h-full"
                                    ></video>
                                )
                            }

                            {
                                vid && (
                                    <video
                                        src={vid}
                                        controls
                                        className="absolute inset-0 object-cover w-full h-full"
                                    ></video>
                                )
                            }
                            <span className='text-gray-400'>Video here</span>
                        </div>
                        {/* {vidMessage && <div className='text-white bg-red-600 my-5 font-semibold text-sm py-5 rounded-md p-3 w-fit'>{vidMessage}</div>} */}
                        <div>
                            <input
                                type="file"
                                ref={vidInputRef}
                                style={{ display: 'none' }}
                                onChange={handleVidChange}
                                accept="video/*"
                            />
                            <button onClick={handleVidClick} className='px-10 text-sm bg-main/50 text-main rounded w-fit py-2'>{target.vid}</button>
                        </div>

                    </div>
                </div>

                <div className='flex flex-col gap-1'>
                    <label htmlFor="" className='text-sm font-semibold'>{target.about_company}</label>
                    <textarea onChange={handleTextChange} value={companyDetails.overview} name="overview" rows={10} id="" className='p-2 rounded-md border-2 border-main/20'></textarea>
                </div>

                <div className='flex flex-col gap-1'>
                    <label htmlFor="" className='text-sm font-semibold'>{target.contact_info}</label>
                    <textarea onChange={handleTextChange} value={companyDetails.contact} name="contact" rows={10} id="" className='p-2 rounded-md border-2 border-main/20'></textarea>
                </div>

                <div className='flex flex-col gap-1'>
                    <label htmlFor="" className='text-sm font-semibold'>{target.equal_opp}</label>
                    <textarea onChange={handleTextChange} value={companyDetails.statement} name="statement" rows={10} id="" className='p-2 rounded-md border-2 border-main/20'></textarea>
                </div>

                <button disabled={empLoading} onClick={handleCompanySubmit} className='px-5 w-48 text-center flex justify-center py-2 rounded bg-main text-white'>
                    {empLoading ? <PiSpinner className='animate-spin text-2xl ' /> : target.save_company}
                </button>
            </form>
        </section>
    )
}
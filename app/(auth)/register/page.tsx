"use client"
import React, { useContext, useEffect, useState } from 'react'
import lang from "@/app/(auth)/page.json"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from '@/components/headers';
import { LanguageData } from '@/app/context';
import PasswordInput from '@/components/password';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { FaRegUser, FaToolbox, FaUpload } from 'react-icons/fa';
import Navbar from '@/components/nav';
import Footer from '@/components/footer';
import PhoneInput from 'react-phone-number-input'
import { PiSpinner } from "react-icons/pi";
import 'react-phone-number-input/style.css'
import { useCreateAccountMutation } from '@/app/api/features/candidates';
import { useCreateEmployerAccountMutation } from '@/app/api/features/employer';
import Link from 'next/link';
import RegistrationSuccess from '@/components/registrationSuccess';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';


const jsonData: any = lang;

const validateEmail: any = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export default function Register() {
    const [phoneValue, setValue] = useState<any>('')
    const [empPhoneValue, setEmpValue] = useState<any>('')
    const languageContext = useContext(LanguageData);
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const route = useRouter();

    const [submitData, { isLoading, error, isSuccess, isError }] = useCreateAccountMutation<any>();

    const [submitEmployerData, { isLoading: empLoading, error: empError, isSuccess: empSuccess, isError: empIsError }] = useCreateEmployerAccountMutation<any>()

    if (!languageContext) {
        throw new Error("LanguageData context is not provided!");
    }

    const [language, setLanguage] = languageContext;
    const target: any = jsonData[language]


    //   Data control for candidate
    const [canData, setCanData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        type: 'talent'
    });
    const [password, setPassword] = useState('');
    const [emailValidity, setEmailValidity] = useState(false)
    const [terms, setTerms] = useState(false)
    const [notTerms, setNotTerms] = useState(false)
    const [passLength, setPassLength] = useState(false)
    const [passwordValidity, setPasswordValidity] = useState(false)
    const [mailcheck, setMailcheck] = useState(false)

    // Image upload states for candidate
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [resume, setResume] = useState<File | null>(null)
    const [certificate, setCertificate] = useState<File | null>(null)
    const [profileImagePreview, setProfileImagePreview] = useState<string>('')
    const [profileImageError, setProfileImageError] = useState(false)
    const [resumeError, setResumeError] = useState(false)
    const [certificateError, setCertificateError] = useState(false)

    const handleCandidate = async (e: any) => {
        e.preventDefault();

        // Validate profile image
        if (!profileImage) {
            setProfileImageError(true);
            return;
        } else {
            setProfileImageError(false);
        }
        // validate resume and certificate
        if (!resume) {
            setResumeError(true);
            return;
        } else {
            setResumeError(false);
        }
        if (!certificate) {
            setCertificateError(true);
            return;
        } else {
            setCertificateError(false);
        }

        if (validateEmail(canData.email)) {
            setEmailValidity(false);
            if (password === canData.password) {
                setPasswordValidity(false)
                if (canData.password.length >= 6) {
                    setPassLength(false)
                    if (terms) {
                        setNotTerms(false)

                        const formData = new FormData();
                        formData.append('name', canData.first_name);
                        formData.append('lastName', canData.last_name);
                        formData.append('email', canData.email);
                        formData.append('phoneNumber', canData.phone_number);
                        formData.append('type', canData.type);
                        formData.append('password', canData.password);
                        formData.append('profileImage', profileImage);
                        formData.append('resume', resume);
                        formData.append('certificate', certificate);


                        try {
                            const res = await submitData(formData).unwrap();
                            if (res) {
                                toast('Registration Successfull!')
                                setMailcheck(true)
                                console.log(mailcheck);
                            }
                        } catch (err) {
                            console.error(err);
                            toast('Error occured!')
                            setMailcheck(false)
                        }
                    } else {
                        setNotTerms(true)
                    }
                } else {
                    setPassLength(true)
                }
            } else {
                setPasswordValidity(true)
            }
        } else {
            setEmailValidity(true)
        }
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setCanData(prev => ({
            ...prev, [name]: value
        }))
    };

    const handleProfileImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setProfileImageError(false);
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResumeChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setResume(file);
            setResumeError(false);
        }
    };

    const handleCertificateChange = (e: any) => {
        // accept only images files
        const file = e.target.files[0];
        if (file) {
            setCertificate(file);
            setCertificateError(false);
        }
        
    };


    useEffect(() => {
        setCanData(prev => ({
            ...prev,
            phone_number: phoneValue
        }))
    }, [phoneValue])



    // Data for Employer   
    const [empPassword, setEmpPassword] = useState('');
    const [empEmailValidity, setEmpEmailValidity] = useState(false)
    const [empTerms, setEmpTerms] = useState(false)
    const [notEmpTerms, setNotEmpTerms] = useState(false)
    const [empPassLength, setEmpPassLength] = useState(false)
    const [empPasswordValidity, setEmpPasswordValidity] = useState(false)

    const [empData, setEmpData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        type: 'employer'
    });

    // Image upload states for employer
    const [logo, setLogo] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string>('')
    const [logoError, setLogoError] = useState(false)

    const handleEmployer = async (e: any) => {
        e.preventDefault();

        // Validate logo
        if (!logo) {
            setLogoError(true);
            return;
        } else {
            setLogoError(false);
        }

        if (validateEmail(empData.email)) {
            setEmpEmailValidity(false);
            if (empPassword === empData.password) {
                setEmpPasswordValidity(false)
                if (empData.password.length >= 6) {
                    setEmpPassLength(false)
                    if (empTerms) {
                        setNotEmpTerms(false)

                        const formData = new FormData();
                        formData.append('name', empData.first_name);
                        formData.append('lastName', empData.last_name);
                        formData.append('email', empData.email);
                        formData.append('phoneNumber', empData.phone_number);
                        formData.append('type', empData.type);
                        formData.append('password', empData.password);
                        formData.append('logo', logo);

                        try {
                            const res = await submitEmployerData(formData).unwrap();
                            if (res) {
                                toast('Registration Successfull!')
                                setMailcheck(true)
                            }
                        } catch (err) {
                            console.error(err);
                            toast('Error occured!')
                        }
                    } else {
                        setNotEmpTerms(true)
                    }
                } else {
                    setEmpPassLength(true)
                }
            } else {
                setEmpPasswordValidity(true)
            }
        } else {
            setEmpEmailValidity(true)
        }
    }

    const handleEmpChange = (e: any) => {
        const { name, value } = e.target;
        setEmpData(prev => ({
            ...prev, [name]: value
        }))
    }

    const handleLogoChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            setLogoError(false);
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        setEmpData(prev => ({
            ...prev,
            phone_number: empPhoneValue
        }))
    }, [empPhoneValue])

    return (
        <>
            <Navbar isScrolled = {true} />
            <ToastContainer />

            <section className='h-fit mb-20 [@media(min-width:2000px)]:max-w-[2300px] [@media(min-width:2000px)]:h-[1000px] mx-auto px-5 relative w-screen flex items-center justify-center'>
                {
                    isSuccess && empSuccess && (
                        <RegistrationSuccess target={target} />
                    )
                }


                <div className="w-[85%] h-fit md:w-1/2 lg:w-1/3 space-y-10 mt-36">
                    {/* <Header title=/> */}
                    <h2 className='text-2xl sm:text-2xl font-bold'>{target.register_header} </h2>
                    <Tabs defaultValue="candidate" className="w-full">
                        <TabsList>
                            <TabsTrigger value="candidate" className='flex gap-3 items-center'><FaRegUser /> {target.register_candidate}</TabsTrigger>
                            <TabsTrigger value="employer" className='flex gap-3 items-center'><FaToolbox /> {target.register_employer}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="candidate" className=' py-3'>
                            {mailcheck && <div className='bg-black p-3 rounded text-white text-center text-sm mb-3'>
                                Registration successfull! Check Email for verification
                            </div>}
                            <form onSubmit={handleCandidate} className='space-y-5'>
                                {isError && error.status === 409 && <div className='w-full text-xs p-2 text-center font-semibold rounded-md text-white bg-red-600'>
                                    {target.email_taken || 'Error occured! Try again'}
                                </div>}
                                <div className='flex justify-between gap-3'>
                                    <input onChange={handleChange} type='text' name='last_name' required placeholder={target.last_name} className='w-full p-2 rounded-md border-2 border-main' />
                                    <input onChange={handleChange} type='text' name='first_name' required placeholder={target.other_names} className='w-full p-2 rounded-md border-2 border-main' />
                                </div>

                                <div>
                                    <input onChange={handleChange} type='email' name='email' required placeholder={target.email} className='w-full p-2 rounded-md 
                        border-2 border-main' />
                                    {emailValidity && <div className='w-full text-xs py-2 font-semibold rounded-md text-red-600'>
                                        {target.valid_email}
                                    </div>}
                                </div>
                                <div className='w-full p-2 rounded-md border-2 border-main'>
                                    <PhoneInput
                                        defaultCountry="CN"
                                        placeholder={target.phone_number}
                                        value={phoneValue}
                                        onChange={setValue}
                                    />
                                </div>

                                {/* Profile Image Upload */}
                                <div>
                                    <label className='block text-sm font-medium mb-2'>Profile Image *</label>
                                    <div className='flex items-center gap-4'>
                                        <div className='flex-1'>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleProfileImageChange}
                                                className='w-full p-2 rounded-md border-2 border-main'
                                            />
                                        </div>
                                        {profileImagePreview && (
                                            <div className='w-16 h-16 rounded-full overflow-hidden border-2 border-main'>
                                                <img
                                                    src={profileImagePreview}
                                                    alt="Profile preview"
                                                    className='w-full h-full object-cover'
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {profileImageError && <div className='w-full text-xs py-2 font-semibold rounded-md text-red-600'>
                                        Profile image is required
                                    </div>}
                                </div>

                                {/* upload resume and certificate */}
                                <div className='mt-5'>
                                    <label className='block text-sm font-medium mb-2'>Resume *</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleResumeChange}
                                        className='w-full p-2 rounded-md border-2 border-main'
                                    />
                                </div>

                                <div className='mt-5'>
                                    <label className='block text-sm font-medium mb-2'>Certificate *</label>
                                    <input
                                        type="file"
                                        // image files only
                                        accept="image/*"
                                        onChange={handleCertificateChange}
                                        className='w-full p-2 rounded-md border-2 border-main'
                                    />
                                </div>

                                <div className=''>
                                    <div className='flex gap-3'>
                                        <div className='w-full relative h-5'>
                                            <input required value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder={target.password} type={`${showPassword ? "text" : "password"}`} className=' p-2 rounded-md  w-full border-2 border-main absolute  z-10 pr-10' />
                                            <div onClick={() => setShowPassword(!showPassword)} className='absolute z-20 right-3 hover:cursor-pointer h-10 flex items-center'>
                                                {
                                                    showPassword ? <IoEyeOff className='text-2xl text-gray-500' /> : <IoEye className='text-2xl text-gray-500' />
                                                }

                                            </div>

                                        </div>

                                        <div className='w-full h-5 relative mb-2'>
                                            <div className='w-full relative mb-10'>
                                                <input onChange={handleChange} required name='password' placeholder={target.confirm_password} type={`${showPasswordConfirm ? "text" : "password"}`} className=' p-2 rounded-md  w-full border-2 border-main absolute  z-10 pr-10' />
                                                <div onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className='absolute z-20 right-3 hover:cursor-pointer h-10 flex items-center'>
                                                    {
                                                        showPasswordConfirm ? <IoEyeOff className='text-2xl text-gray-500' /> : <IoEye className='text-2xl text-gray-500' />

                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {passwordValidity && <div className='w-full text-xs pt-5 font-semibold rounded-md text-red-600'>
                                        {target.pass_match}
                                    </div>}
                                    {passLength && <div className='w-full text-xs pt-5 font-semibold rounded-md text-red-600'>
                                        {target.pass_char}
                                    </div>}

                                </div>

                                <div className='text-xs pt-5'>
                                    <div className='flex items-center  gap-3'>
                                        <input type='checkbox' checked={terms} onClick={() => setTerms(!terms)} />
                                        <Link href={'/terms'} className=''>{target.conditions}</Link>
                                    </div>
                                    {
                                        notTerms && <div className='w-full text-xs pt-2 font-semibold rounded-md text-red-600'>
                                            {target.pls_terms}
                                        </div>
                                    }
                                </div>

                                <div className='pt-5'>
                                    <button className='w-full p-2 bg-main flex justify-center rounded-md text-white'>
                                        {isLoading ? <PiSpinner className='animate-spin text-2xl ' /> : target.register}
                                    </button>
                                </div>
                            </form>
                        </TabsContent>

                        <TabsContent value="employer" className=' py-3'>
                            {mailcheck && <div className='bg-black p-3 rounded text-white text-center text-sm mb-3'>
                                Registration successfull! Check Email for verification
                            </div>}
                            <form onSubmit={handleEmployer} className='space-y-5'>
                                {empIsError && empError.status === 409 && <div className='w-full text-xs p-2 text-center font-semibold rounded-md text-white bg-red-600'>
                                    {target.email_taken}
                                </div>}
                                <div className='flex justify-between gap-3'>
                                    <input onChange={handleEmpChange} type='text' name='last_name' required placeholder={target.last_name} className='w-full p-2 rounded-md border-2 border-main' />
                                    <input onChange={handleEmpChange} type='text' name='first_name' required placeholder={target.other_names} className='w-full p-2 rounded-md border-2 border-main' />
                                </div>

                                <div>
                                    <input onChange={handleEmpChange} type='email' name='email' required placeholder={target.email} className='w-full p-2 rounded-md 
                        border-2 border-main' />
                                    {empEmailValidity && <div className='w-full text-xs py-2 font-semibold rounded-md text-red-600'>
                                        {target.valid_email}
                                    </div>}
                                </div>
                                <div className='w-full p-2 rounded-md border-2 border-main'>
                                    <PhoneInput
                                        defaultCountry="CN"
                                        placeholder={target.phone_number}
                                        value={empPhoneValue}
                                        onChange={setEmpValue}
                                    />
                                </div>

                                {/* Logo Upload */}
                                <div>
                                    <label className='block text-sm font-medium mb-2'>Company Logo *</label>
                                    <div className='flex items-center gap-4'>
                                        <div className='flex-1'>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                className='w-full p-2 rounded-md border-2 border-main'
                                            />
                                        </div>
                                        {logoPreview && (
                                            <div className='w-16 h-16 rounded-md overflow-hidden border-2 border-main'>
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo preview"
                                                    className='w-full h-full object-cover'
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {logoError && <div className='w-full text-xs py-2 font-semibold rounded-md text-red-600'>
                                        Company logo is required
                                    </div>}
                                </div>

                                <div className=''>
                                    <div className='flex gap-3'>
                                        <div className='w-full relative h-5'>
                                            <input required value={empPassword} onChange={(e: any) => setEmpPassword(e.target.value)} placeholder={target.password} type={`${showPassword ? "text" : "password"}`} className=' p-2 rounded-md  w-full border-2 border-main absolute  z-10 pr-10' />
                                            <div onClick={() => setShowPassword(!showPassword)} className='absolute z-20 right-3 hover:cursor-pointer h-10 flex items-center'>
                                                {
                                                    showPassword ? <IoEyeOff className='text-2xl text-gray-500' /> : <IoEye className='text-2xl text-gray-500' />

                                                }

                                            </div>

                                        </div>

                                        <div className='w-full h-5 relative mb-2'>
                                            <div className='w-full relative mb-10'>
                                                <input onChange={handleEmpChange} required name='password' placeholder={target.confirm_password} type={`${showPasswordConfirm ? "text" : "password"}`} className=' p-2 rounded-md  w-full border-2 border-main absolute  z-10 pr-10' />
                                                <div onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className='absolute z-20 right-3 hover:cursor-pointer h-10 flex items-center'>
                                                    {
                                                        showPasswordConfirm ? <IoEyeOff className='text-2xl text-gray-500' /> : <IoEye className='text-2xl text-gray-500' />

                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {empPasswordValidity && <div className='w-full text-xs pt-5 font-semibold rounded-md text-red-600'>
                                        {target.pass_match}
                                    </div>}
                                    {empPassLength && <div className='w-full text-xs pt-5 font-semibold rounded-md text-red-600'>
                                        {target.pass_char}
                                    </div>}

                                </div>

                                <div className='text-xs pt-5'>
                                    <div className='flex items-center  gap-3'>
                                        <input type='checkbox' checked={empTerms} onClick={() => setEmpTerms(!empTerms)} />
                                        <Link href={'/'} className=''>{target.conditions}</Link>
                                    </div>
                                    {
                                        notEmpTerms && <div className='w-full text-xs pt-2 font-semibold rounded-md text-red-600'>
                                            {target.pls_terms}
                                        </div>
                                    }
                                </div>

                                <div className='pt-5'>
                                    <button className='w-full p-2 bg-main flex justify-center rounded-md text-white'>
                                        {empLoading ? <PiSpinner className='animate-spin text-2xl ' /> : target.register}
                                    </button>
                                </div>
                            </form>
                        </TabsContent>

                    </Tabs>
                </div>
            </section>
            <Footer />
        </>
    )
}
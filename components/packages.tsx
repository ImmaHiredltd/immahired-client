import { usePayForPackageMutation, useUpGradePackageMutation } from '@/app/api/general';
import React, { useContext, useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { PiSpinner } from 'react-icons/pi';
import { toast } from 'react-toastify';
import { IoMdFlower } from "react-icons/io";
import { GiCaptainHatProfile, GiCrystalGrowth, GiStarSattelites, GiStoneWheel, GiWindSlap } from 'react-icons/gi';
import { RiRestartFill } from 'react-icons/ri';
import { FaCreditCard, FaStar, FaFire } from 'react-icons/fa';
import { SiPaypal } from 'react-icons/si';
import { IoClose } from 'react-icons/io5';
import { HiSparkles } from 'react-icons/hi2';
import Cookies from 'js-cookie';
import { UserData } from '@/app/tokenContext';

interface PackagesProps {
    plan: any;
    target: any;
    packType: string;
    role: string;
    isPromotional?: boolean;
}

export default function Packages({ plan, target, packType, role, isPromotional = false }: PackagesProps) {
    const [submitData, { isLoading, error, isError }] = usePayForPackageMutation<any>()
    const [submitId, { isLoading: packageLoading }] = useUpGradePackageMutation()
    const [active, setActive] = useContext(UserData);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe');

    const emp = role === 'employer';
    const tee = Cookies.get('token');
    var packageStatus: any;

    if (tee) {
        packageStatus = JSON.parse(tee);
        console.log("packageStatus", packageStatus)
    }

    const handleGetStarted = () => {
        if (!active) {
            toast('Please sign in to get started!')
            return
        }

        if (packageStatus?.data?.type !== role && active) {
            toast('Invalid Package!')
            return
        }

        // Show payment method selection modal
        setShowPaymentModal(true);
    }

    const processPayment = async () => {
        const packageJson = {
            package: packType,
            paymentMethod: selectedPaymentMethod,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://immahired.global'}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://immahired.global'}/cancel`
        }

        try {
            if (packageStatus?.data?.package) {
                const data = {
                    return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://immahired.global'}/`
                }
                const res = await submitId(data).unwrap();
                window.open(await res.url, '_blank');
            } else {
                const res = await submitData(packageJson).unwrap();
                window.open(await res.url, '_blank');
            }
            setShowPaymentModal(false);
        } catch (err) {
            console.error(err);
            setShowPaymentModal(false);
        }
    }

    if (isError) {
        if (error?.status === 401) {
            toast('Please sign to get started!')
        } else {
            toast(error?.data?.message)
        }
    }

    // Get package styling based on type and promotional status
    const getPackageStyle = () => {
        if (isPromotional) {
            return {
                container: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white transform ring-4 ring-yellow-400 ring-opacity-60',
                button: 'border-white hover:bg-white hover:text-orange-600 text-white font-bold shadow-lg'
            };
        }

        const styles = {
            rookie: { container: 'bg-red-500 text-white', button: 'border-white hover:bg-white hover:text-black text-white' },
            expert: { container: 'bg-white', button: 'border-gray-400 hover:bg-black hover:text-white text-black' },
            growth: { container: 'bg-yellow-500', button: 'border-white hover:bg-white hover:text-black text-white' },
            pro: { container: 'bg-purple-400', button: 'border-white hover:bg-white hover:text-black text-white' },
            elite: { container: 'bg-gray-500', button: 'border-white hover:bg-white hover:text-black text-white' },
            default: { container: 'bg-main/50', button: 'border-white hover:bg-white hover:text-black text-white' }
        };

        return styles[packType as keyof typeof styles] || styles.default;
    };

    const packageStyle = getPackageStyle();

    return (
        <>
            <div className={`px-4 min-w-[320px] py-8 rounded-xl shadow-gray-300 shadow-xl ${packageStyle.container} w-full sm:w-[32%] space-y-8 relative transition-all duration-300 ${isPromotional ? 'animate-pulse-subtle' : ''}`}>

                {/* Promotional Badge */}
                {isPromotional && (
                    <>
                        {/* Floating Badge */}
                        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform rotate-12 z-10">
                            <div className="flex items-center gap-1">
                                <FaFire className="text-xs" />
                                <span>{target.promo}</span>
                                <FaFire className="text-xs" />
                            </div>
                        </div>

                        {/* Promotional ribbon */}
                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-pink-600 to-purple-700 text-white text-center py-2 text-xs font-bold">
                            <div className="flex items-center justify-center gap-1">
                                <FaStar className="text-yellow-300" />
                                <span className='uppercase'>{target.limited_time_offer}</span>
                                <FaStar className="text-yellow-300" />
                            </div>
                        </div>
                    </>
                )}

                <div className={`flex flex-col gap-3 ${isPromotional ? 'mt-8' : ''}`}>
                    <h2 className='font-semibold flex gap-2 items-center'>
                        <span className='text-4xl'>{packType === 'rookie' ? <IoMdFlower /> : packType === 'professional' ? <GiWindSlap /> : packType === 'expert' ? <GiStoneWheel /> : packType === 'growth' ? <GiCrystalGrowth /> : packType === 'starter' ? <RiRestartFill /> : packType === 'pro' ? <GiCaptainHatProfile /> : <GiStarSattelites />} </span>
                        {packType.toUpperCase()}
                        {isPromotional && <HiSparkles className="text-yellow-300 animate-pulse" />}
                    </h2>
                    {plan.job_top ? <h2 className='text-2xl font-semibold'>{plan.period} {target.year}</h2> :
                        <h2 className='text-2xl font-semibold'>{plan.months !== -1 ? plan.months : 'One Time'} {plan.months !== -1 ? target.months : ''}</h2>
                    }
                </div>

                {/* Price with promotional styling */}
                <div className="relative">
                    <h1 className={`text-4xl font-bold ${isPromotional ? 'text-yellow-100' : ''}`}>
                        ${plan.price}
                    </h1>
                </div>

                <div className='space-y-3 max-sm:text-xs text-sm'>
                    <div className='flex items-center gap-4'>
                        <span className={isPromotional ? 'text-yellow-300' : ''}>
                            <FaCheck />
                        </span>
                        <span>
                            {(emp ? plan.jobPostings : plan.resumePostings) == -1 ? target.unlimited : (emp ? plan.jobPostings : plan.resumePostings)} {emp ? target.job_posting : target.resume_posting}
                        </span>
                    </div>

                    <div className='flex items-center gap-4'>
                        <span className={isPromotional ? 'text-yellow-300' : ''}>
                            <FaCheck />
                        </span>
                        <span>
                            {(emp ? plan.downloadResumes : plan.jobApplications) == -1 ? target.unlimited : (emp ? plan.downloadResumes : plan.jobApplications)} {emp ? target.download_resume : target.app}
                        </span>
                    </div>

                    {emp && <div className='flex items-center gap-4'>
                        <span className={isPromotional ? 'text-yellow-300' : ''}>
                            <FaCheck />
                        </span>
                        <span>
                            {(emp ? plan.automaticJobRefreshals : plan.automaticResumeRefreshals) == -1 ? target.unlimited : (emp ? plan.automaticJobRefreshals : plan.automaticResumeRefreshals)} {emp ? target.refresh_jobs : target.refresh_resume}
                        </span>
                    </div>}
                    {emp && <div className='flex items-center gap-4'>
                        <span className={isPromotional ? 'text-yellow-300' : ''}>
                            <FaCheck />
                        </span>
                        <span>
                            {emp ? target.job_top : target.resume_top}(  {(emp ? plan.refreshJobToTop : plan.refreshResumeToTop) == -1 ? target.unlimited : (emp ? plan.refreshJobToTop : plan.refreshResumeToTop)}{target.times})
                        </span>
                    </div>}
                    <div className='flex items-center gap-4'>
                        <span className={isPromotional ? 'text-yellow-300' : ''}>
                            <FaCheck />
                        </span>
                        <span>
                            {(emp ? plan.receiveTalentApplicationAlerts : plan.dailyEmployersChatPerDay) == -1 ? target.unlimited : (emp ? plan.receiveTalentApplicationAlerts : plan.dailyEmployersChatPerDay)} / {target.chats}
                        </span>
                    </div>

                    {emp && <div className='flex items-center gap-4'>
                        <span className={isPromotional ? 'text-yellow-300' : ''}>
                            <FaCheck />
                        </span>
                        <span>
                            {(emp ? plan.jobPostingAdverstiments : plan.upgradeTalentSelfIntroductionVideo) == -1 ? target.unlimited : (emp ? plan.jobPostingAdverstiments : plan.upgradeTalentSelfIntroductionVideo)} {emp ? target.job_ad : target.intro_vid}
                        </span>
                    </div>}

                    <div className='flex items-center gap-4'>
                        <span className={isPromotional ? 'text-yellow-300' : ''}>
                            <FaCheck />
                        </span>
                        <span>
                            {(emp ? plan.viewTalentsContacts : plan.viewEmployersContacts) == -1 ? target.unlimited : (emp ? plan.viewTalentsContacts : plan.viewEmployersContacts)} {emp ? target.talent : target.employer}
                        </span>
                    </div>

                    <div className='flex items-center gap-4'>
                        <span className={isPromotional ? 'text-yellow-300' : ''}>
                            <FaCheck />
                        </span>
                        <span>
                            {emp ? target.talent_app : target.job_app}({(emp ? plan.receiveTalentApplicationAlerts : plan.receiveJobApplicationAlerts) == -1 ? target.unlimited : (emp ? plan.receiveTalentApplicationAlerts : plan.receiveJobApplicationAlerts)})
                        </span>
                    </div>
                </div>

                <button
                    disabled={isLoading || packageLoading}
                    onClick={handleGetStarted}
                    className={`w-full py-3 rounded-xl max-sm:text-sm flex justify-center border-2 bg-transparent transition-all duration-300 ${packageStyle.button} ${isPromotional ? 'animate-pulse-button' : ''}`}
                >
                    {isLoading || packageLoading ? (
                        <PiSpinner className='animate-spin text-2xl' />
                    ) : (
                        <span className="flex items-center gap-2">
                            {isPromotional && <FaFire />}
                            {target.get_started}
                            {isPromotional && <FaFire />}
                        </span>
                    )}
                </button>

                {isPromotional && (
                    <div className="text-center text-sm text-yellow-200 font-medium">
                        ⏰ {target.offer_comming_soon}
                    </div>
                )}
            </div>

            {/* Payment Method Selection Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Choose Payment Method</h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                <IoClose />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-6 text-sm">
                            Select your preferred payment method to continue with your {packType.toUpperCase()} package.
                            {isPromotional && <span className="text-orange-600 font-medium"> Don&#39;t miss this limited-time offer!</span>}
                        </p>

                        <div className="space-y-3 mb-6">
                            <div
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedPaymentMethod === 'stripe'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => setSelectedPaymentMethod('stripe')}
                            >
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        id="stripe"
                                        name="paymentMethod"
                                        value="stripe"
                                        checked={selectedPaymentMethod === 'stripe'}
                                        onChange={() => setSelectedPaymentMethod('stripe')}
                                        className="text-blue-500"
                                    />
                                    <FaCreditCard className="text-blue-600 text-xl" />
                                    <label htmlFor="stripe" className="font-medium text-gray-800 cursor-pointer">
                                        Credit Card / Debit Card
                                    </label>
                                </div>
                            </div>

                            <div
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedPaymentMethod === 'paypal'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => setSelectedPaymentMethod('paypal')}
                            >
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        id="paypal"
                                        name="paymentMethod"
                                        value="paypal"
                                        checked={selectedPaymentMethod === 'paypal'}
                                        onChange={() => setSelectedPaymentMethod('paypal')}
                                        className="text-blue-500"
                                    />
                                    <SiPaypal className="text-blue-600 text-xl" />
                                    <label htmlFor="paypal" className="font-medium text-gray-800 cursor-pointer">
                                        PayPal
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={processPayment}
                                disabled={isLoading || packageLoading}
                                className={`flex-1 py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center ${isPromotional
                                    ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                            >
                                {isLoading || packageLoading ? (
                                    <PiSpinner className="animate-spin text-lg" />
                                ) : (
                                    <span className="flex items-center gap-1">
                                        {isPromotional && <FaFire />}
                                        Continue
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
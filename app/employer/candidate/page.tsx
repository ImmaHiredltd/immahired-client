"use client"
import Header from '@/components/headers'
import React, { useContext, useEffect, useState } from 'react'
import lang from "@/app/employer/candidate/page.json"
import pp from '@/public/images/no-image.jpg'
import { LanguageData } from '@/app/context';
import Image from 'next/image'
import { BsBellFill, BsBookmarkCheckFill, BsChat, BsChatFill } from "react-icons/bs";
import { FaEnvelope, FaLocationPin, FaRegMessage } from 'react-icons/fa6'
import { CiBadgeDollar, CiBookmark, CiBookmarkCheck, CiLocationOn } from 'react-icons/ci'
import { GrUserWorker } from 'react-icons/gr'
import { FaBookmark, FaPhoneAlt, FaRegBookmark } from 'react-icons/fa'
import { HiMiniClipboardDocumentList } from 'react-icons/hi2'
import { GiTie } from "react-icons/gi";
import { useGetJobQuery, useGetPackageStatusQuery } from '@/app/api/general'
import Link from 'next/link'
import { useApproveApplicationMutation } from '@/app/api/features/employer'
import { PiSpinner } from 'react-icons/pi'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'
import { MdNaturePeople } from 'react-icons/md'


const jsonData : any = lang;
export default function CandidateProfile() {
        const languageContext = useContext(LanguageData);
        const [applicant, setApplicant] = useState<any>({}) 
        const [application, setApplication] = useState<any>({}) 
        const [jobId, setJobId] = useState<any>(null)
        const [talentData, setTalentData] = useState<any>(null)
        const { data } = useGetJobQuery(jobId && jobId?.job)
        const [ submitId, {isLoading} ] = useApproveApplicationMutation();
        const [ submitData, {isLoading: loading} ] = useApproveApplicationMutation();
        const { data: statusData, isLoading: statusLoading } = useGetPackageStatusQuery(null)
        const route = useRouter();

       

        if (!languageContext){
            throw new Error("LanguageData context is not provided!");
        }
        const [language, setLanguage] = languageContext;
        const target = jsonData[language];

        useEffect(() => {
            const joby: any = localStorage.getItem('job');
            setJobId(JSON.parse(joby));

            const talent: any = localStorage.getItem('talent');
            setTalentData(JSON.parse(talent))

            const app = localStorage.getItem('profile')
            const job = localStorage.getItem('job')
            const applicationLocal = localStorage.getItem('applicant')
            if(app){
                setApplicant(JSON.parse(app));
            }
            if(applicationLocal){
                setApplication(JSON.parse(applicationLocal));
            }
    
        }, [])

        const handleApprove = async (e: any) => {
            e.preventDefault();
            try{
                const res = await submitId(application.id).unwrap();
                if(await res){
                    toast('Application approved!');
                }
                console.log(await res)
            }catch(err){
                console.error(err)
            }
        }

        const handleRejection = async (e: any) => {
            e.preventDefault();
            try{
                const res = await submitData(application.id).unwrap();
                if(await res){
                    toast('Application rejected!');
                }
            }catch(err){
                console.error(err)
            }
        }

        const goToMessage = () => {
            route.push('/employer/messages/chat');
        }

        const InfoRow = ({ icon, label, value }: any) => (
        <div className="flex items-start gap-3">
            <span className="mt-1 text-gray-400">{icon}</span>
            <div>
            <p className="text-gray-500">{label}</p>
            <p className="font-medium text-gray-800">{value}</p>
            </div>
        </div>
        );

  return (
    <section className='py-2'>
        <ToastContainer />
        <div className='text-2xl flex gap-3 items-center'>
                <span className='text-main text-6xl'><MdNaturePeople /></span>
                {target.application}
            </div>
        
        <div className="mt-6">
  <div className="w-full rounded-2xl bg-white p-8 shadow-lg space-y-10">

    {/* HEADER */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-main/20">
          <Image
            src={applicant ? applicant?.profileImage?.url : pp}
            alt="Candidate image"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold">
            {applicant?.lastName} {applicant?.name}
          </h2>
          <p className="text-sm text-gray-500">
            {target.applied_for}:{" "}
            <span className="font-medium text-black">
              {data?.data.title}
            </span>
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-3">
        {statusLoading && <span className="text-sm">Loading...</span>}

        {statusData?.data.canDownloadResumes && !statusLoading ? (
          <Link
            href={talentData?.resume.url || ""}
            className="rounded-lg bg-main px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            {target.download_resume}
          </Link>
        ) : (
          <span className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600">
            Resume limit reached
          </span>
        )}

        {statusData?.data.canChatTalents && !statusLoading ? (
          <button
            onClick={goToMessage}
            className="rounded-lg border border-main bg-main/10 p-2 text-main hover:bg-main hover:text-white"
          >
            <FaRegMessage />
          </button>
        ) : (
          <span className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600">
            Chat limit reached
          </span>
        )}
      </div>
    </div>

    {/* COVER LETTER */}
    <section className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700">
        {target.cover_letter}
      </h4>
      <p className="text-sm leading-relaxed text-gray-600">
        {application.coverLetter}
      </p>
    </section>

    {/* INFO GRID */}
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      <InfoRow
        icon={<FaPhoneAlt />}
        label={target.phone}
        value={
          statusData?.data.canViewTalentsContacts
            ? applicant?.phoneNumber
            : "********"
        }
      />

      <InfoRow
        icon={<FaEnvelope />}
        label={target.email}
        value={
          statusData?.data.canViewTalentsContacts
            ? applicant?.email
            : "********"
        }
      />

      <InfoRow
        icon={<GrUserWorker />}
        label={target.resposibility}
        value={application.responsibilities}
      />

      <InfoRow
        icon={<HiMiniClipboardDocumentList />}
        label={target.qualifications}
        value={application.certifications?.flatMap((c: any) =>
          c.split("-,")
        )}
      />

      <InfoRow
        icon={<GrUserWorker />}
        label={target.experience}
        value={application?.workExperience}
      />

      <InfoRow
        icon={<GiTie />}
        label={target.career_level}
        value={application.careerLevel}
      />

      <InfoRow
        icon={<CiBadgeDollar />}
        label={target.current_salary}
        value={application?.currentSalary}
      />

      <InfoRow
        icon={<CiBadgeDollar />}
        label={target.salary_expectation}
        value={application?.salaryExpectations}
      />
    </section>

    {/* SKILLS */}
    <section className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">
        {target.skills}
      </h4>
      <div className="flex flex-wrap gap-2">
        {application.skills?.map((skill: any, index: number) => (
          <span
            key={index}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>

    {/* FOOTER ACTIONS */}
    <div className="flex justify-center gap-4 pt-4">
      <button
        disabled={isLoading}
        onClick={handleApprove}
        className="rounded-xl bg-main px-6 py-2 text-white font-medium disabled:opacity-60"
      >
        {isLoading ? (
          <PiSpinner className="animate-spin text-xl" />
        ) : (
          target.approve
        )}
      </button>

      <button
        disabled={loading}
        onClick={handleRejection}
        className="rounded-xl bg-red-600 px-6 py-2 text-white font-medium disabled:opacity-60"
      >
        {loading ? (
          <PiSpinner className="animate-spin text-xl" />
        ) : (
          target.reject
        )}
      </button>
    </div>
  </div>
</div>

    </section>
  )
}

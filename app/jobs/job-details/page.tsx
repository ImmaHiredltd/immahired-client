"use client"
import { JobData, LanguageData } from '@/app/context';
import Navbar from '@/components/nav'
import React, { MouseEventHandler, useContext, useEffect, useState } from 'react'
import { FaArrowRotateLeft, FaBox } from 'react-icons/fa6'
import pageLanguage from './page.json'
import Footer from '@/components/footer';
import { CiBookmark } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import moment from 'moment'
import { PiSpinner } from 'react-icons/pi';
import { useGetPackageStatusQuery, useGetTalentMutation, useSaveJobMutation, useUnsaveJobMutation } from '@/app/api/general';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBookmark, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import { IoMdArrowRoundBack } from 'react-icons/io';
import parse from 'html-react-parser';
import pp from '@/public/images/no-image.jpg'
import ppp from '@/public/images/difference-between-firm-and-company3.png'


export default function JobDetails() {
  const languageContext = useContext(LanguageData);
  const [jobDetails, setJobDetails] = useContext(JobData);
  const { data: statusData, isLoading: statusLoading } = useGetPackageStatusQuery(null)
    const [ submitId, {isLoading, data:repData} ] = useSaveJobMutation();
    const [ submitJobId, { data: resData, isLoading: meloading } ] = useUnsaveJobMutation();
    const [ submitToken, { data: canData } ] = useGetTalentMutation();
    const [savePressed, setSavePressed] = useState(true)
    const [unsavePressed, setunSavePressed] = useState(true)
    const [companyImage, setCompanyImage] = useState<any>(null)
    const [empData, setEmpData] = useState<any>(null);
    const [talentData, setTalentData] = useState<any>(null);
    const [me, setMe] = useState<any>(null)
    



  const [loading, setLoading] = useState(false)
  const route = useRouter()

  useEffect(() => {
    if(!jobDetails){
      route.push('/jobs')
    }

    // Only access localStorage on the client side
    const emp = localStorage.getItem('employer');
    if (emp) {
      setCompanyImage(JSON.parse(emp).data.logo.url || ppp)
      setEmpData(JSON.parse(emp));
    }

    const talent = Cookies.get('talent');
    if (talent) {
      setTalentData(JSON.parse(talent));
    }
  }, [])

  if (!languageContext) {
    throw new Error("LanguageData context is not provided!");
  }
  const jsonData: any = pageLanguage;
  
  const [language, setLanguage] = languageContext;
  const target = jsonData[language]

  

  
  // Function to check if a job is saved
  const isJobSaved = (savedJobs:any, jobId: any) => {
    return savedJobs?.some((job:any) => job.id === jobId);
  };

  // Check for a specific job ID
  const jobSaved = isJobSaved(talentData?.savedJobs, jobDetails?.id);

  console.log(jobDetails)


  const handleApply = () => {
    if(statusData?.data.canApplyToJobs){
      setLoading(true);
      route.push('/apply')
    }else{
      toast('Job application limit reached!')
    }
    
  }

  useEffect(() => {
    const talent = Cookies.get('user');
    var talentData: any;
    if(talent){
        talentData = JSON.parse(talent);
        if(talentData){
          setMe(talentData)
        }
    }
    async function getTalent(){
        if(talentData){
            try{
                const res = await submitToken(talentData.data.id).unwrap()
                
            }catch(err){
                console.error(err)
            }
        }
    }
    getTalent()
  }, [])

  const handleBookmark = async (id: string) => {
    setSavePressed(!savePressed)
    try{
        const res = await submitId(id).unwrap();
        if(await res){
            toast('Job Bookmarked!')
        }
    }catch(err){
        console.log(err)
    }
}

const handleUnBookmark = async (id: string) => {
    setunSavePressed(!unsavePressed)
    try{
        const res = await submitJobId(id).unwrap();
        console.log("delete: ",await res)
        if(await res){
            toast('Job Removed from bookmarks!')
        }
    }catch(err){
        console.log(err)
    }
}

const description = jobDetails?.description
    .trim()
    .split('\n') // Split by new lines
    .map((item: any) => item.trim()) // Trim each item
    .filter((item: any) => item.length > 0); // Filter out empty 
    
    const skills = jobDetails?.requirements
    .trim()
    .split('\n') // Split by new lines
    .map((item: any) => item.trim()) // Trim each item
    .filter((item: any) => item.length > 0); // Filter out empty items

    const responsibility = jobDetails?.instructions
    .trim()
    .split('\n') // Split by new lines
    .map((item: any) => item.trim()) // Trim each item
    .filter((item: any) => item.length > 0); // Filter out empty items

    const handleAbout = (e: any) => {
        e.preventDefault();
        setAboutCompany(true)

    }

    function formatTextWithLineBreaks(text: any) {
      if(text){
        return text.replace(/(\r\n|\n|\r)/g, "<br />");
      }else{
        return;
      }
    }

    const [ aboutCompany, setAboutCompany ] = useState(false)
    

    const CompanyDetails = () => {
      return(
        <div className='w-screen h-screen bg-black/70 fixed items-center justify-center flex z-50 top-0 left-0'>

            <div className='w-[90%] sm:w-[60%] bg-gradient-to-br from-white to-gray-200 relative p-5 rounded shadow-md shadow-black max-h-[80vh] overflow-y-scroll'>
              <button onClick={() => setAboutCompany(false)} className='text-red-500 text-xl absolute top-5 right-5'>
                <FaTimes />
              </button>
                <div className='space-y-5'>
                  <div className='flex items-center gap-3 max-sm:justify-between mt-3'>
                      <span className='p-4 rounded-full border-2 border-gray-300 text-xl bg-green-500 text-white w-20 h-20 relative overflow-hidden  shadow-md shadow-gray-300'>
                        {
                          companyImage && (
                            <Image 
                                src={companyImage}
                                fill
                                alt='Company Image'
                                className='object-cover'
                            />
                          )
                        }
                        {
                          !companyImage && (
                            <FaBox />
                          )
                        }
                      </span>
                    <span className='text-sm sm:text-[2rem] font-extrabold'>{empData?.data.companyName}</span>
                    </div>

                    <div className='flex flex-col gap-3'>
                        <span className='font-semibold'>Company Overview:</span>
                        <span className='text-sm'>{empData?.data.overview}</span>
                    </div>

                    { empData.data.shortVideo.url && 
                    <div className='flex flex-col gap-3'>
                        <span className='text-sm relative h-[200px] sm:h-[300px] flex items-center justify-center shadow-md shadow-gray-400 rounded-xl  overflow-hidden  bg-gray-200 w-full sm:w-[60%]'>
                                
                                    <video 
                                        src={empData.data.shortVideo.url}
                                        controls
                                        className="absolute inset-0 object-cover w-full h-full"
                                    ></video>
                        </span>
                    </div>
                    }
                    <div className='flex flex-col gap-3'>
                        <span className='font-semibold'>Company Information:</span>
                        <span className='text-sm'>{empData?.data.contactInformation && parse(formatTextWithLineBreaks(empData?.data.contactInformation))}</span>
                    </div>

                    <div className='flex flex-col gap-3'>
                        <span className='font-semibold'>Equal Opportunity Statement:</span>
                        <span className='text-sm'>{empData?.data.equalOpportunityStatement}</span>
                    </div>
                </div>
            </div>
        </div>
      )
    }

    const MetaItem = ({ label, value }: any) => (
      <div className="flex flex-col gap-1">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium text-gray-800">{value}</span>
      </div>
    );

    const ContentBlock = ({ title, items }: any) => (
      <div>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <ol className="space-y-3 text-gray-600 max-w-2xl">
          {items?.map((item: any, index: number) => (
            <li key={index} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ol>
      </div>
    );



  return (
    <>
      <Navbar isScrolled = {true} />
      <ToastContainer />
      <section className="px-banner-clamp py-24 space-y-16 bg-gray-50">

  {/* COMPANY / JOB HEADER */}
  <header className="space-y-6">
    {aboutCompany && <CompanyDetails />}

    <button
      onClick={() => window.history.back()}
      className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black"
    >
      <IoMdArrowRoundBack /> Back
    </button>

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      <div>
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
          {jobDetails?.title}
        </h1>
        <p className="mt-2 text-gray-500 text-lg">
          {empData?.data.companyName}
        </p>
      </div>

      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-md ring-1 ring-black/5">
        {companyImage ? (
          <Image
            src={companyImage}
            alt="Company logo"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-2xl text-gray-400">
            <FaBox />
          </div>
        )}
      </div>
    </div>

    <button
      onClick={handleAbout}
      className="rounded-lg bg-main px-5 py-2 text-sm font-medium text-white shadow hover:opacity-90"
    >
      About Company
    </button>
  </header>

  {/* JOB META CARD */}
  <section className="rounded-3xl bg-gray-200 p-8 sm:p-12 shadow-lg space-y-8">
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-2xl font-semibold">{jobDetails?.title}</span>
      <span className="rounded-full bg-main/10 px-4 py-1 text-sm font-medium text-main">
        {jobDetails?.employmentType}
      </span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
      <MetaItem
        label="Date posted"
        value={moment
          .utc(jobDetails?.createdAt)
          .format("MMMM DD, YYYY")}
      />
      <MetaItem label="Location" value={jobDetails?.location} />
      <MetaItem label="Salary" value={jobDetails?.salaryRange} />
      <MetaItem
        label="Deadline"
        value={moment(jobDetails?.deadline).format("MMMM DD, YYYY")}
      />
      <MetaItem
        label="Career level"
        value={jobDetails?.preferredQualification}
      />
      <MetaItem
        label="Qualification"
        value={jobDetails?.requiredQualification}
      />
      <MetaItem label="Experience" value={jobDetails?.benefits} />
    </div>
  </section>

  {/* CONTENT SECTIONS */}
  <section className="space-y-14">
    <ContentBlock title={target.job_description} items={description} />
    <ContentBlock
      title={target.key_responsibilities}
      items={responsibility}
    />
    <ContentBlock title={target.skill} items={skills} />
  </section>

  {/* CTA BAR */}
  <footer className="flex flex-wrap items-center gap-4">
    <button
      disabled={loading || !me?.data.approved}
      onClick={handleApply}
      className="flex-1 rounded-2xl bg-main py-3 text-white font-semibold disabled:opacity-60"
    >
      {loading ? (
        <PiSpinner className="animate-spin text-xl mx-auto" />
      ) : !me?.data.approved ? (
        "Cannot apply until approved by admin"
      ) : (
        target.apply_now
      )}
    </button>

    <button className="rounded-full border border-main/30 bg-white p-4 text-xl text-main hover:bg-main hover:text-white transition">
      {canData?.data.savedJobs.includes(jobDetails.id) ? (
        <FaBookmark
          onClick={() => handleUnBookmark(jobDetails.id)}
          className="text-blue-500"
        />
      ) : isLoading ? (
        "..."
      ) : (
        <CiBookmark onClick={() => handleBookmark(jobDetails.id)} />
      )}
    </button>
  </footer>
</section>

      <Footer />

    </>
  )
}

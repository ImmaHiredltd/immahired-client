"use client"
import Header from '@/components/headers'
import React, { useContext, useEffect, useState } from 'react'
import pageLanguage from "./page.json"
import { LanguageData } from '../context';
import { FaArrowLeft, FaArrowRight, FaSearch } from 'react-icons/fa';
import { CiLocationOn } from 'react-icons/ci';
import Job from '@/components/jobs';
import Navbar from '@/components/nav';
import Footer from '@/components/footer';
import { useGetJobsQuery } from '../api/general';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function Jobs() {
  const languageContext = useContext(LanguageData);
  const { isLoading, isError, error, data, isSuccess } = useGetJobsQuery(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [empType, setEmpType] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [currentApplicantPage, setCurrentApplicantPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0)
  let itemsperpage = 15;
  const lastIndexSlice = currentApplicantPage * itemsperpage;
  const firstIndexSlice = lastIndexSlice - itemsperpage;
  // const [ currentItems, setCurrentItems ] = useState()

  var currentItems = filtered?.slice(firstIndexSlice, lastIndexSlice);

  // useEffect(() => {
  //   setFiltered(currentItems)
  // }, [currentItems])

  useEffect(() => {
    setFiltered(data?.data)

  }, [data])

  useEffect(() => {
    setTotalPages(Math.ceil(filtered?.length / itemsperpage))
  }, [filtered])

  console.log(filtered?.length)

  const nextPage = () => {
    if (currentApplicantPage < totalPages) {
      setCurrentApplicantPage(currentApplicantPage + 1);
    }
  };

  const prevPage = () => {
    if (currentApplicantPage > 1) {
      setCurrentApplicantPage(currentApplicantPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentApplicantPage(page);
  };
  const token = Cookies.get('token')
  var objToken: any;
  if (token) {
    const mt = JSON.parse(token);
    objToken = mt.token
  }
  if (!languageContext) {
    throw new Error("LanguageData context is not provided!");
  }
  const jsonData: any = pageLanguage;

  const [language, setLanguage] = languageContext;
  const target = jsonData[language];

  const route = useRouter();

  const handleSearch = () => {
    if (!objToken) {
      route.push('/login')
    }
    if (jobTitle && !jobLocation && empType === '') {
      const filter = data.data.filter((job: any) => job.title.toLowerCase().includes(jobTitle.toLowerCase()));
      setFiltered(filter);
    }
    if (!jobTitle && jobLocation && empType === '') {
      const filter = data.data.filter((job: any) => job.location.toLowerCase().includes(jobLocation.toLowerCase()));
      setFiltered(filter);
    }
    if (!jobTitle && !jobLocation && empType !== '') {
      const filter = data.data.filter((job: any) => job.employmentType.toLowerCase().includes(empType.toLowerCase()));
      setFiltered(filter);
    }

    if (jobTitle && jobLocation && empType === '') {
      const filter = data.data.filter((job: any) => job.title.toLowerCase().includes(jobTitle.toLowerCase()) && job.location.toLowerCase().includes(jobLocation.toLowerCase()));
      setFiltered(filter);
    }

    if (!jobTitle && jobLocation && empType !== '') {
      const filter = data.data.filter((job: any) => job.employmentType.toLowerCase().includes(empType.toLowerCase()) && job.location.toLowerCase().includes(jobLocation.toLowerCase()));
      setFiltered(filter);
    }

    if (jobTitle && !jobLocation && empType !== '') {
      const filter = data.data.filter((job: any) => job.title.toLowerCase().includes(jobTitle.toLowerCase()) && job.employmentType.toLowerCase().includes(empType.toLowerCase()));
      setFiltered(filter);
    }

    if (jobTitle && jobLocation && empType !== '') {
      const filter = data.data.filter((job: any) => job.title.toLowerCase().includes(jobTitle.toLowerCase()) && job.employmentType.toLowerCase().includes(empType.toLowerCase()) && job.location.toLowerCase().includes(jobLocation.toLowerCase()));
      setFiltered(filter);
    }
  }


  return (
    <>
      <Navbar isScrolled={true} />
      <ToastContainer />
      <section className='px-job-clamp py-40 [@media(min-width:2000px)]:max-w-[2300px] mx-auto'>
        <Header title={target?.jobs} />

        <div className="mt-8 w-full bg-white rounded-xl shadow-md shadow-gray-200 p-4">
  <div className="flex flex-col sm:flex-row sm:items-end gap-3">

    {/* Job Title */}
    <div className="flex-1">
      <label className="block sm:hidden text-xs text-gray-500 mb-1">
        Job Title
      </label>
      <div className="flex items-center gap-2 h-12 px-3 rounded-lg border border-gray-200 focus-within:border-main transition">
        <FaSearch className="text-gray-400" />
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder={target.place_job}
          className="w-full text-sm focus:outline-none"
        />
      </div>
    </div>

    {/* Location */}
    <div className="flex-1">
      <label className="block sm:hidden text-xs text-gray-500 mb-1">
        Location
      </label>
      <div className="flex items-center gap-2 h-12 px-3 rounded-lg border border-gray-200 focus-within:border-main transition">
        <CiLocationOn className="text-lg text-gray-400" />
        <input
          value={jobLocation}
          onChange={(e) => setJobLocation(e.target.value)}
          placeholder="Location"
          className="w-full text-sm focus:outline-none"
        />
      </div>
    </div>

    {/* Employment Type */}
    <div className="flex-1">
      <label className="block sm:hidden text-xs text-gray-500 mb-1">
        Employment Type
      </label>
      <select
        onChange={(e) => setEmpType(e.target.value)}
        className="w-full h-12 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-main transition"
      >
        <option value="">Employment Type</option>
        <option value="internship">Internship</option>
        <option value="contract">Contract</option>
        <option value="fulltime">Full Time</option>
      </select>
    </div>

    {/* Search Button */}
    <div className="sm:w-auto w-full">
      <button
        onClick={handleSearch}
        disabled={isLoading || !objToken || (!jobTitle && !jobLocation && empType === '')}
        className={`w-full sm:w-auto h-12 px-8 rounded-lg text-sm font-semibold text-white bg-main transition
          ${
            isLoading || !objToken
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:opacity-90 active:scale-[0.98]'
          }`}
      >
        {isLoading ? 'Searching…' : target.find_jobs}
      </button>
    </div>

  </div>
</div>


        <div className='mt-10 w-full'>
          <div className=' flex justify-between text-sm'>
            <span className='font-bold'>{target.all_jobs}</span>
          </div>

          <div className='py-10 flex sm:flex-row flex-col flex-wrap gap-10'>
            {
              currentItems && currentItems.map((job: any, index: number) => <Job key={index} data={job} />)
            }
            {
              data && data.data.length === 0 ? "No Jobs Available!" : ''
            }

            {
              objToken && isLoading && (
                <div className='text-md w-full text-center'>
                  Loading jobs...
                </div>
              )
            }

            {
              !objToken && (
                <div>
                  Please sign in to view jobs!
                </div>
              )
            }
          </div>

          {/* Pagination controls */}
          <div className="mt-4 flex md:w-full justify-between">
            <button
              onClick={prevPage}
              disabled={currentApplicantPage === 1}
              className="px-5 py-1 text-xs flex w-[30%] items-center gap-2 font-medium text-gray-500 hover:text-gray-700 "
            >
              <span><FaArrowLeft /></span>
              <span>Previous</span>
            </button>

            {/* Desktop view */}
            <div className="md:flex hidden w-1/3 justify-center space-x-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index + 1)}
                  className={`text-xs min-h-8 min-w-8 flex items-center hover:bg-[#F1F3FF] rounded-xl justify-center border border-primary font-medium ${currentApplicantPage === index + 1
                    ? 'focus:outline-none bg-primary text-white'
                    : 'text-gray-500 hover:text-gray-700 focus:outline-none'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={nextPage}
              disabled={currentApplicantPage === totalPages}
              className="px-5 w-[30%] flex items-center justify-end gap-2 text-right py-1 text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              <span>Next</span>
              <span><FaArrowRight /></span>
            </button>
          </div>

          {/* Mobile view */}
          <div className="md:hidden flex flex-wrap w-full justify-center space-x-4 mt-5">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index + 1)}
                className={`text-xs min-h-8 min-w-8 flex items-center rounded-xl justify-center border border-primary font-medium ${currentApplicantPage === index + 1
                  ? 'focus:outline-none bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700 focus:outline-none'
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

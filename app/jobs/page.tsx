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
import { CustomSelect } from '@/components/customSelect';
import { chinaCities } from '../utils';

export default function Jobs() {
  const languageContext = useContext(LanguageData);
  const { isLoading, isError, error, data, isSuccess } = useGetJobsQuery(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [empType, setEmpType] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const [currentApplicantPage, setCurrentApplicantPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0)
  let itemsperpage = 12;
  const lastIndexSlice = currentApplicantPage * itemsperpage;
  const firstIndexSlice = lastIndexSlice - itemsperpage;
  // const [ currentItems, setCurrentItems ] = useState()

  var currentItems = filtered?.slice(firstIndexSlice, lastIndexSlice);

  // console.log("filtered: ", filtered)

  // useEffect(() => {
  //   setFiltered(currentItems)
  // }, [currentItems])

  useEffect(() => {
    setJobsData(data?.data);
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

  const industries = [
    target.industry_1,
    target.industry_2,
    target.industry_3,
    target.industry_4,
    target.industry_5,
    target.industry_6,
    target.industry_7,
    target.industry_8,
    target.industry_9,
  ];




  const handleSearch = () => {
    if (!data || !data.data) {
      return;
    }
    // Filtering logic including all combinations (title, location, employmentType, city, industry, experience, salary range)
    const filtered = data.data.filter((job: any) => {
      const titleMatch = !jobTitle || (job.title && typeof job.title === 'string' && job.title.toLowerCase().includes(jobTitle.toLowerCase()));
      const locationMatch = !jobLocation || (job.location && typeof job.location === 'string' && job.location.toLowerCase().includes(jobLocation.toLowerCase()));
      const empTypeMatch = !empType || (job.employmentType && typeof job.employmentType === 'string' && job.employmentType.toLowerCase().includes(empType.toLowerCase()));
      const cityMatch = !city || (job.city && typeof job.city === 'string' && job.city.toLowerCase().includes(city.toLowerCase()));
      const industryMatch = !industry || (job.industry && typeof job.industry === 'string' && job.industry.toLowerCase().includes(industry.toLowerCase()));
      const experienceMatch = !experience || (job.experienceLevel && typeof job.experienceLevel === 'string' && job.experienceLevel.toLowerCase().includes(experience.toLowerCase()));
      const filterMin = salaryMin ? parseInt(salaryMin) : 0;
      const filterMax = salaryMax ? parseInt(salaryMax) : Infinity;
      const salaryMatch = (!salaryMin && !salaryMax) || (job.salaryRangeMin != null && job.salaryRangeMax != null && job.salaryRangeMin <= filterMax && job.salaryRangeMax >= filterMin);
      return titleMatch && locationMatch && empTypeMatch && cityMatch && industryMatch && experienceMatch && salaryMatch;
    });
    setFiltered(filtered);
  }

  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [experience, setExperience] = useState("");
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");

  const handleClearFilters = () => {
    setJobTitle("");
    setJobLocation("");
    setEmpType("");
    setCity("");
    setIndustry("");
    setExperience("");
    setSalaryMin("");
    setSalaryMax("");
    setFiltered(jobsData);
  };

  return (
    <>
      <Navbar isScrolled={true} />
      <ToastContainer />
      <section className='px-job-clamp py-36 [@media(min-width:2000px)]:max-w-[2300px] mx-auto'>
        <Header title={target?.jobs} />

        <div className="mt-8 w-full bg-white rounded-xl shadow-md shadow-gray-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Job Title */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">{target.jobs_title}</label>
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

            {/* Country (Locked to China) */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">{target.country}</label>
              <input
                value="China"
                disabled
                className="w-full h-12 px-3 text-sm rounded-lg border border-gray-200 bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* City (Required) */}
            <CustomSelect
              label={target.city}

              value={city}
              onChange={setCity}
              placeholder={target.select_city}
              options={chinaCities.sort().map((c) => ({ label: c, value: c }))}
            />


            {/* Employment Type */}
            <CustomSelect
              label={target.employment_type}
              value={empType}
              onChange={setEmpType}
              placeholder={target.all_types}
              options={[
                { label: target.internship, value: "internship" },
                { label: target.contract, value: "contract" },
                { label: target.full_time, value: "fulltime" },
                { label: target.part_time, value: "parttime" },
                { label: target.temporary, value: "temporary" },
              ]}
            />


            {/* Experience Level */}
            <CustomSelect
              label={target.experience_level}
              value={experience}
              onChange={setExperience}
              placeholder={target.any_level}
              options={[
                { label: target.junior, value: "junior" },
                { label: target.mid, value: "mid" },
                { label: target.senior, value: "senior" },
                { label: target.lead, value: "lead" },
              ]}
            />


            {/* Industry */}
            <CustomSelect
              label={target.industry}
              value={industry}
              onChange={setIndustry}
              placeholder={target.all_industries}
              options={industries.map((item) => ({
                label: item,
                value: item,
              }))}
            />


            {/* Salary Range */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">{target.min_salary}</label>
                <input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder={`¥ ${target.min}`}
                  className="w-full h-12 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-main"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">{target.max_salary}</label>
                <input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder={`¥ ${target.max}`}
                  className="w-full h-12 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-main"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex gap-2 items-end">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className={`w-full h-12 px-8 rounded-lg text-xs font-semibold text-white bg-main transition
                  ${isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90 active:scale-[0.98]"
                  }`}
              >
                {isLoading ? "Searching…" : target.find_jobs}
              </button>

              <button
                onClick={handleClearFilters}
                className="w-full h-12 px-8 rounded-lg text-xs font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 active:scale-[0.98] transition"
              >
                {target.clear_filters}
              </button>
            </div>
          </div>
        </div>



        <div className='mt-10 w-full'>
          <div className=' flex justify-between text-sm'>
            <span className='font-bold'>{target.all_jobs}</span>
          </div>

          <div className='py-10 flex sm:flex-row flex-col justify-between flex-wrap gap-10'>
            {
              currentItems && currentItems.map((job: any, index: number) => <Job key={index} data={job} />)
            }
            {
              data && data.data.length === 0 ? "No Jobs Available!" : ''
            }

            {
              isLoading && (
                <div className='text-md w-full text-center'>
                  <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
              )
            }

            {
              !data && !isLoading && (
                <div className='text-md w-full text-center flex flex-col mx-auto justify-center items-center'>
                  {/* oops gif */}
                    <img src="/images/wired-outline-1140-error-hover-enlarge.gif" alt="Oops!" className="w-96 h-96" />
                    <h2 className='text-red-500 font-semibold sm:w-1/2 text-center'>{target.error_loading}</h2>
                </div>
               )
            }

            {
              filtered && filtered.length === 0 && !isLoading && (
                <div className='text-md w-full text-center'>
                  {target.no_jobs}
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
              <span>{target.prev}</span>
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
              <span>{target.next}</span>
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

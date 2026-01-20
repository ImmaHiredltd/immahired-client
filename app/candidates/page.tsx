"use client"
import Footer from '@/components/footer'
import Navbar from '@/components/nav'
import React, { useEffect, useState } from 'react'
import { useGetCandidatesQuery, useGetMeQuery, useGetPackageStatusQuery } from '../api/general';
import EachCandidate from '@/components/eachCandidate';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Cookies from "js-cookie"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Candidates() {
    const { data, isLoading } = useGetCandidatesQuery(null);
    const [filtered, setFiltered] = useState([]);

    var initialPage = Number(Cookies.get('currentPage')) || 1 ;
    const tokenJson = Cookies.get('token');
    var token: any;
    if(tokenJson){
        token = JSON.parse(tokenJson);
    }

    const [currentApplicantPage, setCurrentApplicantPage] = useState<number | any>(initialPage);
    const [totalPages, setTotalPages] = useState(0)
    const { data: packageData } = useGetPackageStatusQuery(null);
      let itemsperpage = 15;
      const lastIndexSlice = currentApplicantPage * itemsperpage;
      const firstIndexSlice = lastIndexSlice - itemsperpage;
      // const [ currentItems, setCurrentItems ] = useState()

      var currentItems = filtered?.slice(firstIndexSlice, lastIndexSlice);

      const nextPage = () => {
        if (currentApplicantPage < totalPages) {
            setCurrentApplicantPage(currentApplicantPage + 1);
        }
    };

    useEffect(() => {
        // Retrieve and parse the current page from localStorage
    //    if(localStorage){
        const savedPage = Cookies.get('currentPage');
        const parsedPage = savedPage ? JSON.parse(savedPage) : null;
    
        if (parsedPage && !isNaN(parsedPage)) {
          setCurrentApplicantPage(parsedPage);
        } else {
          setCurrentApplicantPage(1); // Default to page 1 if no valid page is saved
        }
    //    }
      }, []);
    
      useEffect(() => {
        // Save the current page to localStorage whenever it changes
        // if (localStorage) {
          Cookies.set('currentPage', JSON.stringify(currentApplicantPage));
        // }
      }, [currentApplicantPage]);
    

    useEffect(() => {
        if(localStorage){
            localStorage.setItem('package', JSON.stringify(packageData))
        }
    }, [packageData])

    const prevPage = () => {
        if (currentApplicantPage > 1) {
            setCurrentApplicantPage(currentApplicantPage - 1);
        }
    };

    const goToPage = (page: number) => {
        setCurrentApplicantPage(page);
    };

    useEffect(() => {
        setFiltered(data?.data)
    }, [data])

    useEffect(() => {
        setTotalPages(Math.ceil(filtered?.length / itemsperpage))
      }, [filtered])

    const [search, setSearch] = useState({
        category: '',
        keyword: '',
        location: ''
    })
      const handleChange = (e: any) => {
        const {name, value} = e.target;
        setSearch((prev) => ({
            ...prev,
            [name]: value
        }))
      }
  
  return (
    <>
        <Navbar isScrolled = {true} />
        <ToastContainer />
        <section className='px-[10px] sm:px-[100px] py-32'>
                <div className="min-h-screen bg-gray- p-4">
            {/* Header Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-wrap gap-4 justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Search by Job Category"
                    value={search.category}
                    name='category'
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 w-full sm:w-[30%]"
                />
                 <input
                    type="text"
                    placeholder="Search by Location"
                    value={search.location}
                    name='location'
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 w-full sm:w-[30%]"
                    />
                <input
                type="text"
                placeholder="Search by Keyword"
                value={search.keyword}
                    name='keyword'
                    onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-[30%]"
                />
            </div>
            
            <div className='mb-5 flex items-center justify-between font-semibold text-xs'>
                <h2 className='text-xl font-semibold'>Candidates</h2>
                <span>{data?.data.length} total Candidates</span>
            </div>
            {
                isLoading && (
                    <div>
                        Loading Candidates..
                    </div>
                )
            }
            {/* User List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems && currentItems.map((user: any, index: number) => (
                    <EachCandidate key={index} candidate={user} me={token} search={search} />
                ))}
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
                 <div className="md:hidden flex flex-wrap w-full justify-center space-x-2 mt-5">
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

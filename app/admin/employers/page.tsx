"use client"
import { useGetEmployersQuery, useDeleteUserMutation } from '@/app/api/general';
import AllEmployers from '@/components/allEmployers';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import DeleteConfirmationModal from '@/components/user/DeleteConfirmationModal';

export type EmpData = {
    id: string,
    createdAt: string,
    updatedAt: string,
    user: {
        id: string | undefined,
        name: string | undefined,
        lastName: string | undefined,
        email: string | undefined,
        type: string | undefined,
        approved: boolean | undefined
    },
    companyName: string,
    overview: string,
    shortVideo: any,
    contactInformation: string,
    equalOpportunityStatement: string
}

interface SearchState {
    category: string;
    keyword: string;
    location: string;
}

export default function Employers() {
    const { data, isLoading, refetch } = useGetEmployersQuery(null);
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const [filtered, setFiltered] = useState<EmpData[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employerToDelete, setEmployerToDelete] = useState<EmpData | null>(null);

    const [search, setSearch] = useState<SearchState>({
        category: '',
        keyword: '',
        location: ''
    })

    const initialPage = 1;
    const tokenJson = Cookies.get('token');
    let token: any;
    if (tokenJson) {
        token = JSON.parse(tokenJson);
    }

    const [currentApplicantPage, setCurrentApplicantPage] = useState<number>(initialPage);
    const [totalPages, setTotalPages] = useState(0)

    const itemsperpage = 12;
    const lastIndexSlice = currentApplicantPage * itemsperpage;
    const firstIndexSlice = lastIndexSlice - itemsperpage;
    const currentItems = filtered?.slice(firstIndexSlice, lastIndexSlice);

    useEffect(() => {
        if (data?.data) {
            let filteredData = data.data;

            // Filter by search category (company name)
            if (search.category) {
                filteredData = filteredData.filter((employer: EmpData) =>
                    employer.companyName?.toLowerCase().includes(search.category.toLowerCase())
                );
            }

            // Filter by approval status
            if (search.location) {
                const isApproved = search.location === 'true';
                filteredData = filteredData.filter((employer: EmpData) =>
                    employer.user?.approved === isApproved
                );
            }

            setFiltered(filteredData);
        }
    }, [data, search])

    useEffect(() => {
        setTotalPages(Math.ceil(filtered?.length / itemsperpage))
    }, [filtered])

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSearch((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleDeleteClick = (employer: EmpData) => {
        setEmployerToDelete(employer);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!employerToDelete) return;

        try {
            await deleteUser(employerToDelete.user.id).unwrap();
            setShowDeleteModal(false);
            setEmployerToDelete(null);
            refetch(); // Refresh the employers list

            // Show success message
            alert('Employer deleted successfully');
        } catch (error) {
            console.error('Error deleting employer:', error);
            alert('Error deleting employer. Please try again.');
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setEmployerToDelete(null);
    };

    return (
        <section>
            <h2 className='font-semibold text-2xl'>All Employers</h2>

            <div className="bg-white rounded-lg shadow-md p-4 flex flex-wrap gap-4 items-center mb-6">
                <input
                    type="text"
                    placeholder="Search by Company name"
                    value={search.category}
                    name='category'
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 w-full sm:w-[30%]"
                />
                <div className="border border-gray-300 rounded-lg p-2 w-full sm:w-[30%] flex">
                    <label htmlFor="">Status: </label>
                    <select name="location" onChange={handleChange} id="" value={search.location} className='w-full'>
                        <option value="">All</option>
                        <option value="true">Approved</option>
                        <option value="false">Pending</option>
                    </select>
                </div>
            </div>
            
            <div className='sm:flex-row flex-col max-sm:items-center flex flex-wrap max-sm:space-y-5 gap-10 mt-5'>
                {
                    currentItems && currentItems.map((datum: EmpData, index: number) =>
                        <AllEmployers
                            key={index}
                            info={datum}
                            search={search}
                            onDelete={handleDeleteClick}
                        />
                    )
                }
                {
                    isLoading && (
                        <div>
                            Loading...
                        </div>
                    )
                }

                {
                    !isLoading && currentItems?.length === 0 && (
                        <div className="text-center text-gray-500 w-full">
                            No employers found matching your search criteria.
                        </div>
                    )
                }
            </div>

            <div className="mt-4 flex md:w-full justify-between">
                <button
                    onClick={prevPage}
                    disabled={currentApplicantPage === 1}
                    className="px-5 py-1 text-xs flex w-[30%] items-center gap-2 font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
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
                    className="px-5 w-[30%] flex items-center justify-end gap-2 text-right py-1 text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
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

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                userName={employerToDelete ? `${employerToDelete.user.name} ${employerToDelete.user.lastName}` : ''}
                userEmail={employerToDelete?.user.email || ''}
                userType={employerToDelete?.user.type || ''}
                isLoading={isDeleting}
            />
        </section>
    )
}
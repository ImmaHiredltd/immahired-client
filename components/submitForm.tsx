"use client"
import React, { useEffect, useState } from 'react'
import Header from './headers'
import Input from './input'
import { useCreateJobMutation, useUpdateJobMutation } from '@/app/api/features/employer'
import Cookies from 'js-cookie'
import { PiSpinner } from 'react-icons/pi'
import { toast } from 'react-toastify'
import { usePathname, useRouter } from 'next/navigation'
import { useGetPackageStatusQuery } from '@/app/api/general'
import { CustomSelect } from './customSelect'
import { chinaCities } from '@/app/utils'

export default function SubmitForm({ target }: { target: any }) {
    const [submitData, { data, isLoading, isError, error, isSuccess }] = useCreateJobMutation();
    const { data: statusData, isLoading: statusLoading } = useGetPackageStatusQuery(null)
    const [updateData, { isLoading: updateLoading }] = useUpdateJobMutation()
    const [myToken, setToken] = useState('');
    const [warn, setWarn] = useState('')
    const route = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        experience: '',
        dead_line: '',
        requirement: '',
        responsibility: '',
        employement: '',
        location: '',
        career_level: '',
        qualification: '',
        description: '',
        salary_range: ''
    });
    const [jobData, setJobData] = useState<any>();
    const tokenData = Cookies.get('token');
    var tokenStatus: any;
    if (tokenData) {
        tokenStatus = JSON.parse(tokenData);
    }

    useEffect(() => {
        if (jobData) {
            setFormData({
                title: jobData.title,
                experience: jobData.benefits,
                dead_line: jobData.deadline,
                requirement: jobData.requirements,
                responsibility: jobData.instructions,
                employement: jobData.employmentType,
                location: jobData.location,
                career_level: jobData.preferredQualification,
                qualification: jobData.requiredQualification,
                description: jobData.description,
                salary_range: jobData.salaryRange
            })
        }
    }, [jobData])

    useEffect(() => {
        const job = localStorage.getItem('job')
        if (job && job) {
            setJobData(JSON.parse(job))
        }
    }, []);

    const pathname = usePathname();

    useEffect(() => {
        // Clear localStorage when the component mounts or the pathname changes
        localStorage.setItem('job', '');
    }, [pathname]);


    const handleChange = (target: any) => {
        const name = target.name
        setFormData((prev: any) => ({
            ...prev,
            [name]: target.value
        }));
    }

    const handleTextareaChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: value
        }))
    }

    const token = Cookies.get('token')
    var objToken: any;

    if (token) {
        const mt = JSON.parse(token);
        objToken = mt.token
    }

    // console.log("Token: ",objToken)
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (formData.employement === '') {
            setWarn('Please select type to continue!');
            return;
        }

        setWarn('');

        const data = {
            "title": formData.title,
            "location": formData.location,
            "description": formData.description,
            "requiredQualification": formData.qualification,
            "preferredQualification": formData.career_level,
            "salaryRange": formData.salary_range,
            "employmentType": formData.employement,
            "instructions": formData.responsibility,
            "deadline": formData.dead_line,
            "benefits": formData.experience,
            "requirements": formData.requirement
        }

        try {
            if (objToken) {
                const res = await submitData({ data, objToken }).unwrap();
                if (await res) {
                    toast(target.job_posted)
                    route.push('/employer/my-jobs')
                }

            } else {
                console.log('No token found!')
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleUpdate = async (e: any) => {
        e.preventDefault();
        const data = {
            "title": formData.title,
            "location": formData.location,
            "description": formData.description,
            "requiredQualification": formData.qualification,
            "preferredQualification": formData.career_level,
            "salaryRange": formData.salary_range,
            "employmentType": formData.employement,
            "instructions": formData.responsibility,
            "deadline": formData.dead_line,
            "benefits": formData.experience,
            "requirements": formData.requirement
        }

        try {
            const res = await updateData({ id: jobData.id, formData: data });
        } catch (err) {
            console.error(err)
        }
    }

    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");
    const [experience, setExperience] = useState("");
    const [city, setCity] = useState("");
    const [industry, setIndustry] = useState("");
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




    return (
        <>
            <section className='sm:px-banner-clamp'>
                <Header title={jobData ? 'Update Job' : target.submit_job} />
                {
                    !statusData?.data.canPostJobs && !statusLoading && (<p className='text-white w-fit mt-5 text-xs font-semibold bg-red-500 px-5 py-2 rounded '>Job Posting for current plan reached! Cannot Post Jobs</p>)
                }

                {
                    (tokenStatus.data.approved === false && !statusLoading) ? (<p className='text-white w-full flex items-center justify-center mt-5 text-xs rounded-lg font-semibold bg-red-500 px-5 py-2 h-[50vh] '>Your account is not approved by Admin yet! Cannot Post Jobs</p>)
                        :
                        <div className='mt-5'>
                            <h3 className='text-xl'>{target.posting_form}</h3>
                            <form className='mt-10 space-y-5'>
                                <div className='flex justify-between sm:gap-10'>
                                    <div className='w-[45%]'>
                                        <Input name='title' onChange={handleChange} value={formData.title} label={target.job_title} placeholder='Software Engineer' />
                                    </div>
                                    <div className='w-[45%] font-black text-black'>
                                        {/* Experience Level */}
                                        <CustomSelect
                                            label="Experience Level"
                                            value={experience}
                                            onChange={setExperience}
                                            placeholder="Select level"
                                            options={[
                                                { label: "Junior", value: "junior" },
                                                { label: "Mid-level", value: "mid" },
                                                { label: "Senior", value: "senior" },
                                                { label: "Lead", value: "lead" },
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div className='flex justify-between gap-10'>
                                    <div className='w-[45%]'>
                                        {warn && <div className='bg-red-500 p-2 text-white rounded text-xs w-fit'>{warn}</div>}
                                        <label htmlFor="" className='text-sm font-semibold'>{target.emp_type}</label>
                                        <select name="employement" required value={formData.employement} onChange={handleTextareaChange} id="" className='w-full p-2 rounded-md border-2 border-main/20'>
                                            <option value="">Select...</option>
                                            <hr className='border border-gray-500' />
                                            <option value="parttime">{target.part_time}</option>
                                            <option value="fulltime">{target.full_time}</option>
                                            <option value="internship">{target.internship}</option>
                                            <option value="contract">{target.contract}</option>
                                            <option value="temporary">{target.temporary}</option>
                                        </select>
                                    </div>
                                    {/* Salary Range */}
                                    <div className=" w-[45%]">
                                        <label className='text-sm font-semibold'>Salary Range (¥)</label>
                                        <div className='flex gap-2'>
                                            <div className="flex-1">
                                                <input
                                                    type="number"
                                                    value={salaryMin}
                                                    onChange={(e) => setSalaryMin(e.target.value)}
                                                    placeholder="¥ Min"
                                                    className="w-full p-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-main"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="number"
                                                    value={salaryMax}
                                                    onChange={(e) => setSalaryMax(e.target.value)}
                                                    placeholder="¥ Max"
                                                    className="w-full p-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-main"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className='flex justify-between gap-10'>
                                    <div className='w-[45%]'>
                                        <Input name='career_level' onChange={handleChange} value={formData.career_level} label={target.career_level} placeholder='Masters' />
                                    </div>

                                    <div className='w-[45%]'>
                                        <Input name='dead_line' onChange={handleChange} value={formData.dead_line} label={target.dead_line} type='date' />
                                    </div>
                                </div>

                                <div className='flex justify-between gap-10'>
                                    <div className='w-[45%]'>
                                        <Input name='qualification' onChange={handleChange} value={formData.qualification} label={target.qualifications} placeholder='MBA' />
                                    </div>
                                    <div className='w-[45%]'>
                                        <Input name='location' onChange={handleChange} value={"China"} disabled={true} label={target.location} placeholder={target.remote} />
                                    </div>
                                </div>

                                <div className='flex justify-between gap-10 font-bold'>
                                    <div className='w-[45%]'>
                                        {/* City (Required) */}
                                        <CustomSelect
                                            label="City"
                                            required
                                            value={city}
                                            onChange={setCity}
                                            placeholder="Select city"
                                            options={chinaCities.sort().map((c) => ({ label: c, value: c }))}
                                        />
                                    </div>
                                    <div className='w-[45%]'>
                                        <CustomSelect
                                            label="Industry"
                                            value={industry}
                                            onChange={setIndustry}
                                            placeholder="Select industry"
                                            options={industries.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                        />
                                    </div>
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="" className='text-sm font-semibold'>{target.job_des}</label>
                                    <textarea name="description" onChange={handleTextareaChange} value={formData.description} rows={10} id="" className='p-2 rounded-md border-2 border-main/20'></textarea>
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="" className='text-sm font-semibold'>{target.skill_ex}</label>
                                    <textarea name="requirement" onChange={handleTextareaChange} value={formData.requirement} rows={10} id="" className='p-2 rounded-md border-2 border-main/20'></textarea>
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="" className='text-sm font-semibold'>{target.key_res}</label>
                                    <textarea name="responsibility" onChange={handleTextareaChange} value={formData.responsibility} rows={10} id="" className='p-2 rounded-md border-2 border-main/20'></textarea>
                                </div>

                                {
                                    jobData ?
                                        <button onClick={handleUpdate} className='w-full rounded-lg bg-main text-white py-3 text-lg flex justify-center'>
                                            {
                                                updateLoading ? <PiSpinner className='animate-spin text-2xl ' /> : 'Update'
                                            }
                                        </button>
                                        :
                                        <button
                                            disabled={isLoading || !statusData?.data.canPostJobs || !tokenStatus.data.approved}
                                            onClick={handleSubmit} className={`${!statusData?.data.canPostJobs || !tokenStatus.data.approved ? 'bg-main/50' : 'bg-main'} w-full rounded-lg text-white py-3 text-lg flex justify-center`}>
                                            {
                                                isLoading ? <PiSpinner className='animate-spin text-2xl ' /> : tokenStatus.data.approved ? target.submit_job : 'Cannot Post job! Not approved by Admin yet!'
                                            }
                                        </button>
                                }

                            </form>
                        </div>
                }
            </section>
        </>
    )
}

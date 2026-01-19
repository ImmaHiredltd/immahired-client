"use client"
import Navbar from '@/components/nav'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { LanguageData } from '../context';
import lang from './page.json'
import Input from '@/components/input';
import Footer from '@/components/footer';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { useGetTalentMutation, useGetUserMutation } from '../api/general';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useApplyJobMutation } from '../api/features/candidates';
import { UserData } from '../tokenContext';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { PiSpinner } from 'react-icons/pi';
import 'react-toastify/dist/ReactToastify.css';
import { RiAttachment2 } from 'react-icons/ri';



const jsonData: any = lang;

export default function Apply() {
    const [ submitToken, { data } ] = useGetTalentMutation()
    const [ submitId, {isLoading: userLoading, data: userData} ] = useGetUserMutation();
    const [ applyJob, { isLoading } ] = useApplyJobMutation();
    const languageContext = useContext(LanguageData);
    const [skills, setSkills] = useState(['']); 
    const [references, setReferences] = useState(['']);
    const [workSamples, setWorkSamples] = useState(['']);
    const [certifications, setCertifications] = useState(['']);
    const [fileObj, setFileObj] = useState<File>()
    const [fileCerObj, setFileCerObj] = useState<File>()
    const [formData, setFormData] = useState({
        workExperience: '',
        salaryExpectation: '',
        currentSalary: '',
        education: '',
        careerLevel: ''
    });
    const [resDocs, setResDocs] = useState({
        resumeName: '',
        resumeUrl: '',
        certificateName: '',
        certificateUrl: ''
    })
    const [responsibility, setResponsibility] = useState('')
    const [coverLetter, setCoverLetter] = useState('')
    const route = useRouter()

    if (!languageContext) {
        throw new Error("LanguageData context is not provided!");
    }
    const token = Cookies.get('token');
    const jobId = Cookies.get('jobId');
    var tokenData: any;
    var jobIdData: any;
    if(token){
        tokenData = JSON.parse(token);
    }
    if(jobId){
        jobIdData = JSON.parse(jobId)
    }

    const [language, setLanguage] = languageContext;
    const target: any = jsonData[language];
    const fileInputRef: any = useRef(null)
    const fileCerInputRef: any = useRef(null)

    useEffect(() => {

        async function getTalent(){
            try{
                const res = await submitToken(tokenData.data.id).unwrap();
            }catch(err){
                console.error(err)
            }
        }

        async function getUser(){
            try{
                const res = await submitId(tokenData.data.id).unwrap();
                if(await res && !res.data.package){
                    route.push('/package')
                }
            }catch(err){
                console.error(err)
            }
        }
        if(tokenData){
            getUser();
            getTalent();
        }else{
            toast('Please sign in!')
           route.push('/login') 
        }  
    }, [])

    useEffect(() => {
        if(data){
            if(data.data.workExperience){
                setFormData(prev => ({
                    ...prev,
                    workExperience: data.data.workExperience
                }));
            }

            if(data.data.resume.name && data.data.resume.url && data.data.certificate.name &&  data.data.certificate.url){
                setResDocs({
                    resumeName: data.data.resume.name,
                    resumeUrl: data.data.resume.url,
                    certificateName: data.data.certificate.name,
                    certificateUrl: data.data.certificate.url
                })
            }
        }
    }, [data]);

    function bytesToMB(bytes: number) {
        return bytes / (1024 * 1024); // 1 MB = 1024 * 1024 bytes
    }

    const validateFile = (file: File) => {
        const allowedFileTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if(bytesToMB(file.size) > 1){
          return false
        }else{
          return allowedFileTypes.includes(file.type)
        }
      }

    //   validate file type and size for images
    const validateImageFile = (file: File) => {
        const allowedImageTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png'
        ];
        if(bytesToMB(file.size) > 1){
          return false
        }else{
          return allowedImageTypes.includes(file.type)
        }
      }

    const handleButtonClick = (e: any) => {
        e.preventDefault()
        fileInputRef.current.click(); // Trigger the hidden file input
    };

    const handleCerClick = (e: any) => {
        e.preventDefault()
        fileCerInputRef.current.click(); // Trigger the hidden file input
    };

    const handleFileChange = (event: any) => {
        if(validateFile(event.target.files[0])){
            setFileObj(event.target.files[0])
        }else{
            toast(bytesToMB(event.target.files[0].size) > 1 ? 'File size more than 1MB' : 'File type not supported');
        }
    };

    const handleFileCerChange = (event: any) => {
        if(validateImageFile(event.target.files[0])){
            setFileCerObj(event.target.files[0])
        }else{
            toast(bytesToMB(event.target.files[0].size) > 1 ? 'File size more than 1MB' : 'File type not supported');
        }
    };

    const handleChange = (target: any) => {
        const {name, value} = target
        setFormData((prev: any) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSkillChange = (index: number, event:any) => {
        const newSkills = [...skills];
        newSkills[index] = event.target.value; // Update the specific skill
        setSkills(newSkills);
      };
    
      const addSkill = () => {
        setSkills([...skills, '']); // Add a new empty skill input
      };

      const removeSkill = (index: number) => {
        const newSkills = skills.filter((_, i) => i !== index); // Remove the skill at the targeted index
        setSkills(newSkills);
      };
    
    
      const handleReferenceChange = (index: number, event: any) => {
        const newReferences = [...references];
        newReferences[index] = event.target.value; // Update the specific reference
        setReferences(newReferences);
      };
    
      const addReference = () => {
        setReferences([...references, '']); // Add a new empty reference input
      };
    
      const removeReference = (index: number) => {
        const newReferences = references.filter((_, i) => i !== index); // Remove the reference at the targeted index
        setReferences(newReferences);
      };
    
     
      const handleSampleChange = (index: number, event: any) => {
        const newSamples = [...workSamples];
        newSamples[index] = event.target.value; // Update the specific work sample
        setWorkSamples(newSamples);
      };
    
      const addWorkSample = () => {
        setWorkSamples([...workSamples, '']); // Add a new empty work sample input
      };
    
      const removeWorkSample = (index: number) => {
        const newSamples = workSamples.filter((_, i) => i !== index); // Remove the work sample at the targeted index
        setWorkSamples(newSamples);
      };
    
    
      const handleCertificationChange = (index: number, event: any) => {
        const newCertifications = [...certifications];
        newCertifications[index] = event.target.value; // Update the specific certification
        setCertifications(newCertifications);
      };
    
      const addCertification = () => {
        setCertifications([...certifications, '']); // Add a new empty certification input
      };
    
      const removeCertification = (index: number) => {
        const newCertifications = certifications.filter((_, i) => i !== index); // Remove the certification at the targeted index
        setCertifications(newCertifications);
      };

      const handleApply = async(e: any) => {
        e.preventDefault();
            let applyForm = new FormData();
            applyForm.append('coverLetter', coverLetter);
            applyForm.append('workExperience', formData.workExperience);
            applyForm.append('currentSalary', formData.currentSalary);
            applyForm.append('salaryExpectations', formData.salaryExpectation);
            applyForm.append('careerLevel', formData.careerLevel);
            applyForm.append('responsibilities', responsibility);
            applyForm.append('education', formData.education);

            if(fileObj){
                applyForm.append('resume', fileObj);
            }

            if(fileCerObj){
                applyForm.append('certificate', fileCerObj)
            }

            if(!fileObj && resDocs.resumeUrl){
                const newFile = new File([resDocs.resumeUrl], resDocs.resumeName, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                if(newFile){
                    applyForm.append('resume', newFile)
                }
            }

            if(!fileCerObj && resDocs.certificateUrl){
                const newFile = new File([resDocs.certificateUrl], resDocs.certificateName, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                if(newFile){
                    applyForm.append('certificate', newFile)
                }
            }

            skills.forEach((skill) => {
                applyForm.append('skills', skill);
            });
            references.forEach((referrence) => {
                applyForm.append('referrences', referrence);
            });
            workSamples.forEach((workSample) => {
                applyForm.append('workSamples', workSample);
            });
            certifications.forEach((certification) => {
                applyForm.append('certifications', certification);
            });

            applyForm.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });


            try{
                const res = await applyJob({id: jobIdData, formData: applyForm, token: tokenData.token});
                console.log(await res)

                // Take to dashboard if success
                if(await res){
                    toast('Applied Successfully!')
                    route.push('/candidate/applied');
                }
            }catch(err){
                console.error(err)
            }
      }
  return (
   <>
         <Navbar isScrolled = {true} />
        <section className='w-full flex items-center justify-center px-banner-clamp py-32'>
            <ToastContainer />
            <div className='w-full sm:w-[60%] h-fit flex flex-col'>
                <h3 className='text-3xl font-semibold'>{target.title}</h3>
                <form action="" className='mt-10 space-y-8'>
                    <div className='flex justify-between'>
                        <div className='w-[45%]'>
                            <Input name='workExperience' value={formData.workExperience} label={target.work_exp} onChange={handleChange}  />
                        </div>
                        <div className='w-[45%]'>
                            <Input name='salaryExpectation' value={formData.salaryExpectation} label={target.salary_expectation} onChange={handleChange}  />
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='w-[45%]'>
                            <Input name='currentSalary' value={formData.currentSalary} label={target.current_salary} onChange={handleChange}  />
                        </div>
                        <div className='w-[45%]'>
                            <Input name='education' value={formData.education} label={target.education} onChange={handleChange}  />
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        {/* <div className='w-[45%]'>
                            <Input name='responsibility' value={formData.responsibility} label={target.responsibility} onChange={handleChange}  />
                        </div> */}
                        <div className='w-full'>
                            <Input name='careerLevel' value={formData.careerLevel} label={target.career_level} onChange={handleChange}  />
                        </div>
                    </div>
                    <div className='w-full'>
                        <label htmlFor="" className='text-sm font-semibold'>{target.responsibility}</label>
                        <textarea required value={responsibility} onChange={(e:any) => setResponsibility(e.target.value)} name="" id="" rows={10}  className='p-2 rounded-md border-2 border-main/20 w-full'>
                        </textarea>
                    </div>
                    <div className='w-full'>
                        <label htmlFor="" className='text-sm font-semibold'>{target.cover_letter}</label>
                        <textarea required value={coverLetter} onChange={(e:any) => setCoverLetter(e.target.value)} name="" id="" rows={10}  className='p-2 rounded-md border-2 border-main/20 w-full'>
                        </textarea>
                    </div>
                    <div>
                        <label htmlFor="" className='text-sm font-semibold'>{target.skills}</label>
                            <div className='space-y-3'>
                                {skills.map((skill, index) => (
                                    <div key={index} className='flex gap-2'>
                                    <input
                                        className='w-full p-2 rounded-md border-2 border-main/20'
                                        type="text"
                                        value={skill}
                                        onChange={(event) => handleSkillChange(index, event)}
                                        placeholder={`Skill ${index + 1}`}
                                        required
                                    />
                                        {index !== 0 && (
                                        <button type="button" className='bg-red-400 hover:bg-red-500 text-white p-5 rounded' onClick={() => removeSkill(index)} style={{ marginLeft: '10px' }}>
                                         <FaRegTrashAlt />
                                        </button>
                                    )}

                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addSkill} className='text-xs px-5 py-2 mt-5 bg-main rounded text-white'>
                                {target.add_skills}
                            </button>
                    </div>

                    <div>
                        <label htmlFor="" className='text-sm font-semibold'>{target.references}</label>
                            <div className='space-y-3'>
                                {references.map((reference: any, index) => (
                                    <div key={index} className='flex gap-2'>
                                    <input
                                        className='w-full p-2 rounded-md border-2 border-main/20'
                                        type="text"
                                        value={reference}
                                        onChange={(event) => handleReferenceChange(index, event)}
                                        placeholder={`Reference ${index + 1}`}
                                        required
                                    />
                                        {index !== 0 && (
                                        <button type="button" className='bg-red-400 hover:bg-red-500 text-white p-5 rounded' onClick={() => removeReference(index)} style={{ marginLeft: '10px' }}>
                                         <FaRegTrashAlt />
                                        </button>
                                    )}

                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addReference} className='text-xs px-5 py-2 mt-5 bg-main rounded text-white'>
                               {target.add_reference}
                            </button>
                    </div>


                    <div>
                        <label htmlFor="" className='text-sm font-semibold'>{target.work_samples}</label>
                            <div className='space-y-3'>
                                {workSamples.map((workSample: any, index) => (
                                    <div key={index} className='flex gap-2'>
                                    <input
                                        className='w-full p-2 rounded-md border-2 border-main/20'
                                        type="text"
                                        value={workSample}
                                        onChange={(event) => handleSampleChange(index, event)}
                                        placeholder={`Sample ${index + 1}`}
                                        required
                                    />
                                        {index !== 0 && (
                                        <button type="button" className='bg-red-400 hover:bg-red-500 text-white p-5 rounded' onClick={() => removeWorkSample(index)} style={{ marginLeft: '10px' }}>
                                         <FaRegTrashAlt />
                                        </button>
                                    )}
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addWorkSample} className='text-xs px-5 py-2 mt-5 bg-main rounded text-white'>
                               {target.add_samples}
                            </button>
                    </div>

                    <div>
                        <label htmlFor="" className='text-sm font-semibold'>{target.certifications}</label>
                            <div className='space-y-3'>
                                {certifications.map((certification: any, index) => (
                                    <div key={index} className='flex gap-2'>
                                    <input
                                        className='w-full p-2 rounded-md border-2 border-main/20'
                                        type="text"
                                        value={certification}
                                        onChange={(event) => handleCertificationChange(index, event)}
                                        placeholder={`Certification ${index + 1}`}
                                        required
                                    />
                                        {index !== 0 && (
                                        <button type="button" className='bg-red-400 hover:bg-red-500 text-white p-5 rounded' onClick={() => removeCertification(index)} style={{ marginLeft: '10px' }}>
                                         <FaRegTrashAlt />
                                        </button>
                                    )}

                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addCertification} className='text-xs px-5 py-2 mt-5 bg-main rounded text-white'>
                               {target.add_certifications}
                            </button>
                    </div>

                    {/* Certificates and Resume */}
                    <div className='flex lg:flex-row flex-col gap-5 justify-between'>
                        <div className='w-full lg:w-[45%] justify-center rounded bg-main/50 shadow-xl shadow-gray-400 px-10 py-5 flex flex-col items-center'>
                            <div className='p-5 flex flex-col items-center gap-3'>
                                <h1 className='text-sm font-semibold text-main flex gap-1 items-center'><RiAttachment2 className='text-xl' /> Resume</h1>
                                {
                                    !fileObj && !resDocs &&
                                    <h2 className='text-sm'>{target.add_resume}</h2>
                                }
                                {
                                    fileObj && (
                                        <>
                                            <div className='p-5 rounded-full shadow-md shadow-gray-700 bg-white text-main w-fit flex items-center justify-center text-2xl'>
                                                <IoDocumentText />
                                            </div>
                                            <div className='text-sm text-black font-semibold'>
                                                {fileObj.name}
                                            </div>
                                        </>
                                    )
                                }
                                {
                                    !fileObj && resDocs.resumeUrl && (
                                        <>
                                            <Link href={resDocs.resumeUrl} className='p-5 rounded-full bg-white text-main shadow-md shadow-gray-700 w-fit flex items-center justify-center text-2xl'>
                                                <IoDocumentText />
                                            </Link>
                                            <div className='text-sm text-black font-semibold'>
                                                {resDocs.resumeName}
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                            <div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    accept=".pdf,.doc,.docx"
                                    style={{ display: 'none' }} 
                                    onChange={handleFileChange} 
                                />
                                <button onClick={handleButtonClick} className='px-8 py-2 rounded text-sm bg-main text-white'>
                                    {target.upload_resume}
                                </button>
                            </div>
                            <div className='text-xs mt-5 text-red-500'>
                                {target.types}
                            </div>
                            <div className='text-xs mt-2 text-red-500'>
                                {target.warn}
                            </div>
                        </div>
                        <div className='w-full lg:w-[45%] justify-center rounded bg-main/50 px-10 py-5 flex flex-col items-center shadow-xl shadow-gray-400'>
                            <div className='p-5 flex flex-col items-center gap-3'>
                                <h1 className='text-sm font-semibold flex gap-1 items-center text-main'><RiAttachment2 className='text-xl' />  Certificate</h1>
                                {
                                    !fileCerObj && !resDocs &&
                                    <h2 className='text-sm'>{target.add_certification}</h2>
                                }
                                {
                                    fileCerObj && (
                                        <>
                                            <div className='p-5 rounded-full bg-white shadow-md shadow-gray-700 text-main w-fit flex items-center justify-center text-2xl'>
                                                <IoDocumentText />
                                            </div>
                                            <div className='text-sm'>
                                                {fileCerObj.name}
                                            </div>
                                        </>
                                    )
                                }
                                {
                                    !fileCerObj && resDocs.certificateUrl &&  (
                                        <>
                                            <Link href={resDocs.certificateUrl} className='p-5 shadow-md shadow-gray-700  rounded-full bg-white text-main w-fit flex items-center justify-center text-2xl'>
                                                <IoDocumentText />
                                            </Link>
                                            <div className='text-sm font-semibold'>
                                                {resDocs.certificateName || target.add_certification}
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                            <div>
                                <input 
                                    type="file" 
                                    ref={fileCerInputRef} 
                                    style={{ display: 'none' }} 
                                    accept="image/*"
                                    onChange={handleFileCerChange} 
                                />
                                <button onClick={handleCerClick} className='px-8 py-2 rounded bg-main text-sm text-white'>
                                    {target.upload_certificate}
                                </button>
                            </div>
                            <div className='text-xs mt-5 text-red-500'>
                                upload image
                            </div>
                            <div className='text-xs mt-2 text-red-500'>
                                {target.warn}
                            </div>
                        </div>
                        
                    </div>

                    <button disabled={isLoading} onClick={handleApply} className='flex p-3 rounded-md bg-main text-white w-full justify-center'>
                        {isLoading ? <PiSpinner className='animate-spin text-2xl ' /> : target.apply_now}
                    </button>
                </form>
            </div>
        </section>
        <Footer />
   </>
  )
}

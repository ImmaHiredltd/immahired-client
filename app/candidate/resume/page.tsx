"use client"
import React, { useContext, useEffect, useRef, useState } from 'react'
import lang from "./page.json"
import packageLang from "@/app/employer/submit-job/page.json"

import { LanguageData } from '@/app/context';
import Header from '@/components/headers';
import Input from '@/components/input';
import { IoDocumentOutline } from 'react-icons/io5';
import { useRefreshResumeMutation, useUpdateDocMutation } from '@/app/api/features/candidates';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PiSpinner } from 'react-icons/pi';
import { useGetPackageStatusQuery, useGetTalentMutation, useGetUserMutation } from '@/app/api/general';
import { url } from 'inspector';
import Link from 'next/link';
import SubmitPackage from '@/components/submitPackage';
import { SiReadthedocs } from 'react-icons/si';

const jsonData: any = lang;
const jsonPackage: any = packageLang;

export default function Resume() {
  const languageContext = useContext(LanguageData);
  const [ submitId, {isLoading: packageLoading, data: packageData} ] = useGetUserMutation();
  const [ submitDoc, {data:doc, isLoading, isSuccess, isError, error } ] = useUpdateDocMutation<any>();
  const [ loadDocs, { isLoading: docLoading, isSuccess: docSuccess, data } ] = useGetTalentMutation();
  const { data: statusData, isLoading: statusLoading } = useGetPackageStatusQuery(null)
  const [ submitToken ] = useRefreshResumeMutation();

  const cookieToken = Cookies.get('token');
  var tokenData: any;
  if(cookieToken){
    tokenData = JSON.parse(cookieToken);
  }
  
  if (!languageContext) {
    throw new Error("LanguageData context is not provided!");
  }

  const [language, setLanguage] = languageContext;
  const target = jsonData[language]
  const packLang = jsonPackage[language];
  const [workExp, setWorkExp] = useState('')
  const [durationValue, setDurationValue] = useState('')
  const [comDuration, setComDuration] = useState('')
  const [exp, setExp] = useState('')
  const [selectedFile, setSelectedFile] = useState<any>()
  const [selectedCertificate, setSelecteCertificate] = useState<any>()
  const fileInputRef: any = useRef(null)
  const certificate: any = useRef(null)
  const [resumeFiles, setResumeFiles] = useState({
    name: '',
    url: '',
    cerName: '',
    cerUrl: ''
  });


  const duration = (e: any) => {
    setDurationValue(e.target.value)
  }

  useEffect(() => {
    setComDuration(workExp + ' ' + durationValue)
  }, [workExp, durationValue])

  useEffect(() => {
    async function getTalent(){
      try{
        const res = await loadDocs(tokenData.data.id).unwrap();
        console.log("Retrieved talent: ",await res)
      }catch(err){
        console.error(err)
      }
    }

    async function getUser(){
      try{
        const res = await submitId(tokenData.data.id).unwrap();
      }catch(err){
        console.error(err);
      }
    }
    getTalent();
    getUser()
  }, [])

  useEffect(() => {
      if(data){
        setResumeFiles({
          name: data.data.resume.name,
          url: data.data.resume.url,
          cerName: data.data.certificate.name,
          cerUrl: data.data.certificate.url
        });
        setExp(data.data.workExperience);

      }
  }, [data])

    const token = Cookies.get('token');
    var tokenData: any;
    if(token){
      tokenData = JSON.parse(token);
    }

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

    const validateCertificate = (file: File) => {
      const allowedFileTypes = [
        'image/jpeg',  // JPEG image
        'image/png',   // PNG image
        'image/webp',  // WebP image
        'image/svg+xml' // SVG image
      ];
      if(bytesToMB(file.size) > 1){
        return false
      }else{
        return allowedFileTypes.includes(file?.type)
      }

    }

    const handleButtonClick = () => {
        fileInputRef.current.click(); // Trigger the hidden file input
    };
    const handleCertificateClick = () => {
      certificate.current.click(); // Trigger the hidden file input
    }
    const handleCertificateChange = (event: any) => {
      if(validateCertificate(event.target.files[0])){
          setSelecteCertificate(event.target.files[0])
      }else{
        toast(bytesToMB(event.target.files[0].size) > 1 ? 'File size more than 1MB' : target.not_valid);
      }
   };

    const handleFileChange = (event: any) => {
       if(validateFile(event.target.files[0])){
          setSelectedFile(event.target.files[0])
        }else{
          toast(bytesToMB(event.target.files[0].size) > 1 ? 'File size more than 1MB' : target.not_valid);
        }
    };

  const handleChange = (e: any) => {
      setWorkExp(e.value)
  }

  const handleDoc = async (e: any) => {
      e.preventDefault();
      const documents:any = new FormData();
      documents.append('workExperience', comDuration);
      documents.append('resume', selectedFile);
      documents.append('certificate', selectedCertificate)

      setExp(comDuration)

        // Log the contents of the FormData
        for (let [key, value] of documents.entries()) {
          console.log(`${key}: ${value instanceof File ? value : value}`);
        }
      try{
        const res = await submitDoc({token: tokenData.token, formData: documents}).unwrap()
        console.log(await res)
      }catch(err){
        console.error(err);
      }
  }

 if(isSuccess){
    toast(target.doc_uploaded)
 }

 const refreshResume = async () => {
    try{
      const res = await submitToken(data.data.id).unwrap();
      if(res){
        toast(res.message);
      }
    }catch(err){
      console.error(err)
    }
 }

 const [november, setNovember] = useState(false)

 const isNovember2024 = () => {
  const currentDate = new Date();
  const cutoffDate = new Date(2024, 11, 1); // December 1, 2024
  if(currentDate < cutoffDate){
    setNovember(true)
  }else{
    setNovember(false)
  }
}


 console.log("me: ",packageData)
  return (
    packageLoading ? <div className='flex justify-center items-center h-screen'>
      <PiSpinner className='animate-spin text-4xl text-black' />
    </div>
    : 
      packageData && packageData.data.package && !packageLoading
      ?
      <>
        <section className='py-5'>
          <ToastContainer />
            
            <div className='text-2xl flex gap-3 items-center'>
                <span className='text-main text-6xl'><SiReadthedocs /></span>
                {target.edit_docs}
            </div>
                {/* <button onClick={refreshResume} disabled={statusData && !statusData.data.canRefreshResumeToTop} className={`p-3 rounded bg-main text-white text-xs mt-5 ${statusData && statusData.data.canRefreshResumeToTop ? 'bg-main' : 'bg-main/50' }`}>Refresh Resume to the top</button> */}
            <div className="mt-10 w-full sm:w-[70%] space-y-8">

  {/* WORK EXPERIENCE */}
  <section className="rounded-xl border border-white/10 bg-abstract p-6 shadow-md">
    <h3 className="text-lg font-semibold text-white mb-4">
      {target.work_exp}
      <span className="ml-2 text-sm text-gray-300">
        {exp ? exp : "Not specified"}
      </span>
    </h3>

    <div className="flex flex-wrap items-end gap-4">
      <div className="w-full sm:w-1/4">
        <Input
          label="Years of Experience"
          required
          onChange={handleChange}
          name="experience"
          value={workExp}
          type="number"
        />
      </div>

      <select
        onChange={duration}
        className="h-10 rounded-md bg-main px-4 text-sm text-white focus:outline-none"
      >
        <option value="">Duration</option>
        <option value="weeks">Weeks</option>
        <option value="months">Months</option>
        <option value="years">Years</option>
      </select>
    </div>
  </section>

  {/* RESUME */}
  <section className="rounded-xl border border-white/10 bg-abstract p-6 shadow-md text-white">
    <h3 className="text-lg font-semibold mb-4">{target.resume}</h3>

    {(selectedFile || (resumeFiles.name && resumeFiles.url)) && (
      <div className="flex items-center gap-4 mb-4">
        <div className="p-4 rounded-full bg-main text-xl">
          <IoDocumentOutline />
        </div>
        <div className="text-sm">
          <p className="font-medium">
            {selectedFile?.name || resumeFiles.name}
          </p>
          {!selectedFile && (
            <Link
              href={resumeFiles.url}
              className="text-xs text-gray-400 underline"
            >
              View document
            </Link>
          )}
        </div>
      </div>
    )}

    <input
      type="file"
      ref={fileInputRef}
      hidden
      onChange={handleFileChange}
    />

    {statusData?.data.canPostResumes ? (
      <button
        onClick={handleButtonClick}
        className="rounded-md bg-main px-6 py-2 text-xs font-medium"
      >
        {target.browse}
      </button>
    ) : (
      <div className="w-fit rounded-md bg-main/30 px-6 py-2 text-xs text-red-300">
        Resume upload limit reached
      </div>
    )}

    <p className="mt-3 text-sm text-gray-400">{target.warn}</p>
    <p className="text-sm">{target.types}</p>
  </section>

  {/* EDUCATION / CERTIFICATE */}
  <section className="rounded-xl border border-white/10 bg-abstract p-6 shadow-md text-white">
    <h3 className="text-lg font-semibold mb-4">{target.education}</h3>

    {isError && (
      <div className="mb-4 rounded-md bg-red-600 px-6 py-2 text-xs">
        {error?.data.message}
      </div>
    )}

    {(selectedCertificate ||
      (resumeFiles.cerName && resumeFiles.cerUrl)) && (
      <div className="mb-4 space-y-3">
        <p className="text-sm">
          {target.certificate_att} (MBA, PhD, Masters)
        </p>

        <div className="rounded bg-white p-3 text-xs font-semibold text-black w-fit">
          Ensure the uploaded image is high resolution
        </div>

        <div className="flex items-center gap-4">
          <div className="p-4 rounded-full bg-main text-xl">
            <IoDocumentOutline />
          </div>
          <span className="text-xs">
            {selectedCertificate?.name || resumeFiles.cerName}
          </span>
        </div>
      </div>
    )}

    <input
      type="file"
      ref={certificate}
      hidden
      onChange={handleCertificateChange}
    />

    {statusData?.data.canPostResumes ? (
      <button
        onClick={handleCertificateClick}
        className="rounded-md bg-main px-6 py-2 text-xs font-medium"
      >
        {target.browse}
      </button>
    ) : (
      <div className="w-fit rounded-md bg-main/30 px-6 py-2 text-xs text-red-300">
        Upload limit reached
      </div>
    )}

    <p className="mt-3 text-sm text-gray-400">{target.warn}</p>
    <p className="text-sm">{target.typesCer}</p>
  </section>

  {/* SAVE BUTTON */}
  <div className="pt-4">
    <button
      disabled={isLoading}
      onClick={handleDoc}
      className="flex items-center justify-center gap-2 rounded-lg bg-main px-10 py-2 text-white disabled:opacity-60"
    >
      {isLoading ? (
        <PiSpinner className="animate-spin text-xl" />
      ) : (
        target.save_changes
      )}
    </button>
  </div>
</div>

            
        </section>
      </>
      : !packageLoading && <SubmitPackage target={packLang} />
  )
}

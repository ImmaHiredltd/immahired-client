"use client"
import { useDeleteJobMutation, useEmployerApplicationMutation, useRefreshJobsMutation } from '@/app/api/features/employer';
import React, { useEffect, useState } from 'react'
import { PiSpinner } from 'react-icons/pi';
import { useRouter } from 'next/navigation';
import { RiDeleteBinLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { useGetPackageStatusQuery } from '@/app/api/general';

export default function TableRow ({ job, target }: any){
  const [numberOfApplicants, setNumberOfApplicants] = useState<number | null>(null);
  const { data: statusData } = useGetPackageStatusQuery(null)
  const [ submitToken, {isLoading} ] = useRefreshJobsMutation();
  const [deleteJob, { isLoading: deleteLoading }] = useDeleteJobMutation();
  const [ submitId, {data} ] = useEmployerApplicationMutation();
  const [loading, setLoading] = useState<boolean>(true);
  const [remove, setDelete] = useState(false);
  const [jobId, setJobId] = useState("");
  const route = useRouter()

    useEffect(() => {
      const getNumberOfApplicants = async () => {
        setLoading(true);
        try {
          const res = await submitId(job.id).unwrap();
          setNumberOfApplicants(res.data.length);
        } catch (err) {
          console.error(err);
          setNumberOfApplicants(0); // Handle error case
        } finally {
          setLoading(false);
        }
      };
      getNumberOfApplicants();
    }, []);

    

    const changeRoute = (job: any) => {
       if(localStorage){
        localStorage.setItem("job", JSON.stringify(job));
        route.push("/employer/submit-job");
       }
      };

      const handleBin = (id: string) => {
        setJobId(id);
        setDelete(true);
      };

      const handleDelete = async () => {
        try {
          const res = await deleteJob(jobId).unwrap();
          if(await res) {
            setDelete(false);
            toast("Job Deleted!");
          }
        } catch (err) {
          console.error(err);
        }
      };
      
      const viewApplicants = () => {
       if(localStorage){
        localStorage.setItem('applicants', JSON.stringify(data.data));
        route.push('/employer/applicants')
       }
      }

      const refreshJob = async () => {
          try{
            const res = await submitToken(job.id).unwrap();
            console.log(res)
            // console.log(job)
          }catch(err){
            console.error(err);
          }
      }
    

      const Delete = () => {
        return (
          <section className="w-screen h-screen fixed flex items-center justify-center left-0 z-50 top-0 bg-black/70 text-xs lg:text-sm">
            <div className="p-10 rounded space-y-4 w-[500px] bg-white ">
              <h1 className="text-xl font-semibold text-center text-black ">{target.sure}</h1>
              <div className="flex gap-2 justify-center">
                <button onClick={handleDelete} className="bg-red-500 text-white px-10 py-2 rounded">
                  {deleteLoading ? <PiSpinner className="animate-spin text-xl" /> : target.yes}
                </button>
                <button onClick={() => setDelete(false)} className="border text-black rounded border-main px-10 py-2">
                  {target.no}
                </button>
              </div>
            </div>
          </section>
        );
      };

    return (
        <>
            {remove && <Delete />}
            <tr className='text-xs lg:text-sm'>
                <td>{job.title}</td>
                <td>{job.location}</td>
                <td>{job.employmentType}</td>
                <td>{job.requiredQualification}</td>
                <td>{job.deadline}</td>
                <td>{loading ? <PiSpinner className="animate-spin" /> : numberOfApplicants} { numberOfApplicants && numberOfApplicants > 0 ? <button onClick={viewApplicants} className='text-xs bg-main text-white p-1 ml-2 rounded'>View</button> : '' }</td>
                <td>
                  <button onClick={refreshJob} disabled={statusData && !statusData.data.canRefreshJobToTop} className={`px-3 py-1 rounded flex justify-center text-white text-[10px] ${statusData && statusData.data.canRefreshJobToTop ? 'bg-main' : 'bg-main/50 opacity-20' }`}>{isLoading ? <PiSpinner className='animate-spin text-sm ' /> : 'Refresh'}</button>
                </td>
                <td>
                <div className="gap-3 flex">
                    <button onClick={() => changeRoute(job)} className="bg-main/50 hover:bg-main px-3 py-2">
                    Edit
                    </button>
                    <button onClick={() => handleBin(job.id)} className="bg-red-600 hover:bg-red-500 px-3 py-2">
                    <RiDeleteBinLine />
                    </button>
                </div>
                </td>
            </tr>
        </>
    );
  };
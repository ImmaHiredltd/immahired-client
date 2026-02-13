"use client";
import React, { useContext, useEffect, useState } from "react";
import lang from "@/app/employer/my-jobs/page.json";
import { LanguageData } from "@/app/context";
import { useRouter } from "next/navigation";
import Header from "@/components/headers";
import { FaSearch } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import {
  useDeleteJobMutation,
  useEmployerApplicationMutation,
} from "@/app/api/features/employer";
import { useGetJobsQuery } from "@/app/api/features/employer";
import Cookies from "js-cookie";
import { PiSpinner } from "react-icons/pi";

import { toast, ToastContainer } from "react-toastify";
import TableRow from "@/components/TableRow";

const jsonData: any = lang;

export default function MyJobs() {
  const languageContext = useContext(LanguageData);
  const {data, isLoading} = useGetJobsQuery(null);
  const [remove, setDelete] = useState(false);
  const [jobId, setJobId] = useState("");
  const token = Cookies.get("token");
  let objToken: any;

  if (token) {
    const mt = JSON.parse(token);
    objToken = mt.token;
  }
  
  if (!languageContext) {
    throw new Error("LanguageData context is not provided!");
  }
  const [language] = languageContext;
  const target = jsonData[language];

  const route = useRouter();

  return (
    <>
      
      <section className="">
        <ToastContainer />
        {/* <Header title={target.my_jobs} /> */}
        <h2 className="text-[2rem] font-semibold">{target.my_jobs}</h2>

        

        <div className="mt-5">
          <h3 className="text-xl font-semibold">{target.manage_jobs}</h3>

          <div className="max-sm:w-screen max-sm:overflow-x-scroll  p-4 bg-abstract shadow-xl shadow-gray-400 rounded-lg mt-5 space-y-5">
            {/* <div className="w-[40%] rounded-lg px-2 py-1 bg-gray-200 text-black flex items-center">
              <input placeholder={target.search} className="w-[90%] focus:outline-none bg-transparent" />
              <button className="h-full w-[10%] flex items-center p-3 rounded-xl text-main justify-center">
                <FaSearch />
              </button>
            </div> */}

            <div className="rounded-md min-w-[910px]">
              <table className="w-full text-white ">
                <thead className="bg-main text-xs lg:text-sm">
                  <tr>
                    <th>{target.title}</th>
                    <th>{target.location}</th>
                    <th>{target.type}</th>
                    <th>{target.required}</th>
                    <th>{target.dead_line}</th>
                    <th>{target.application}</th>
                    <th>{target.refresh}</th>
                    <th>{target.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan={7} className="flex justify-center py-5">
                        <PiSpinner className="animate-spin text-6xl" />
                      </td>
                    </tr>
                  )}
                  {
                    data && data.data.length === 0 ? <p className="py-4 text-lg">No Jobs found!</p> : ''
                  }
                  {data && data.data.map((job: any, index: number) => (
                    <TableRow key={index} target={target} job={job} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

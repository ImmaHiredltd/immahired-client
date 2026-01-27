'use client'
import Footer from "@/components/footer";
import Navbar from "@/components/nav";
import React, { useEffect, useState } from "react";
import pp from '@/public/images/no-image.jpg'
import { FaArrowCircleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { MdVerified } from "react-icons/md";
import Cookies from "js-cookie";
export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [mypackage, setMyPackage] = useState<any>(null);
  const [talent, setTalent] = useState<any>(null);

  const tokenData = Cookies.get('token');
    var tokenStatus: any;
    if(tokenData){
        tokenStatus = JSON.parse(tokenData);
    }
    useEffect(() => {
      if(localStorage){
          // Only access localStorage on the client side
          const getUser = localStorage.getItem('viewCandidate');
          if (getUser) {
            setUser(JSON.parse(getUser));
          }

          // Only access localStorage on the client side
          const getPackge = localStorage.getItem('package');
          if (getPackge) {
            setMyPackage(JSON.parse(getPackge));
          }

          const getTalent = localStorage.getItem('candidateTalent');
          if (getTalent) {
            setTalent(JSON.parse(getTalent));
          }
      }
  }, []);



    const route = useRouter();
    const goToChat = () => {
       if(localStorage){
          localStorage.setItem('profile', JSON.stringify(user && user?.data))
          route.push('/employer/messages/chat');
       }
    }

  return (
   <>
        <Navbar isScrolled = {true} />
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg max-h-[70vh] overflow-y-scroll shadow-lg p-6 w-full max-w-2xl">
          <button onClick={() => window.history.back()} className="hover:text-gray-600 flex items-center gap-2 mb-5">
                <FaArrowCircleLeft /> Back
            </button>
            <div className="flex items-center mb-4">
              <img
                src={user?.data.profileImage.url ? user?.data.profileImage.url : pp}
                alt={user?.data.name}
                className="w-24 h-24 rounded-full object-cover mr-4 bg-black"
              />
              <div>
                <h2 className="text-2xl font-semibold text-blue-600 flex gap-1 items-center">{user?.data.lastName} {user?.data.name} {user?.data.approved && <MdVerified /> }</h2>
                <p className="text-gray-500">
                  {user?.data.gender} | {user?.data.age} y/o | {user?.data.location}
                </p>
              </div>
            </div>
          
            {
              mypackage && mypackage.data.canViewTalentsContacts &&
            <p className="text-gray-700 mt-2">
              <strong>Email:</strong> {user?.data.email}
            </p>
            }
            {user?.data.jobCategory && <p className="text-gray-700 mt-2 flex flex-col gap-1 text-sm">
              <strong>Job Category</strong> 
              <span>
              {user?.data.jobCategory}
              </span>
            </p>}
           {user?.data.description && <p className="text-gray-700 mt-2 flex flex-col gap-1 text-sm">
              <strong>Description</strong> 
              <span>{user?.data.description}</span>
            </p>}
          

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              {
                mypackage && mypackage.data.canChatTalents &&
              <button disabled={ tokenStatus && !tokenStatus?.data.approved} onClick={goToChat} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                {tokenStatus?.data.approved ? 'Message' : 'Cannot message'}
              </button>
    }
              {mypackage && mypackage.data.canDownloadResumes && <a
                href={talent.resume?.url}
                download
                className={`${talent.resume?.url ? 'opacity-100 hover:bg-green-600' : 'opacity-40' } bg-green-500 text-white px-4 py-2 rounded-lg `}
              >
                Download Resume
              </a>}
            </div>
          </div>
        </div>
        <Footer />
   </>
  );
}

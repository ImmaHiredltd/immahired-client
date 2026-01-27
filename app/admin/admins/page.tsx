"use client"
import { useGetAdminsQuery } from '@/app/api/general'
import AllAdmins from '@/components/allAdmins';
import { User } from '@/components/allCandidates';
import AllEmployers from '@/components/allEmployers';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';


export type Admins = {
  "id": string,
  "createdAt": string,
  "updatedAt":string,
  "name": string,
  "lastName": string,
  "phoneNumber": string,
  "email": string,
  "profileImage": any,
  "type": string,
  "age": number,
  "location": string,
  "description": string,
  "gender": string,
  "approved": boolean,
  "jobCategory": string,
  "package": string,
  "subscribed": boolean,
  "verified": boolean
}
export default function Admins() {
    const { data, isLoading } = useGetAdminsQuery(null);
    const [filter, setFilter] = useState([]);

    console.log(data)
    const tokenData = Cookies.get('token');
    var token: any;
    if(tokenData){
      token = JSON.parse(tokenData);
    }
    useEffect(() => {
      if(data){
        const filter = data.data.filter((datum: Admins) => datum.email !== token?.data.email )
        setFilter(filter)
      }
    }, [data])
  return (
    <section>
      <h2 className='font-semibold text-2xl'>Administrators</h2>

      <div className='sm:flex-row flex-col max-sm:items-center flex flex-wrap max-sm:space-y-5 gap-10 mt-5'>
        {
          filter && filter.map((datum: Admins, index: number) => 
            <AllAdmins info={datum} key={index} />
        )
        }

        {
                isLoading && (
                    <div>
                        Loading...
                    </div>
                )
            }     
      </div>
    </section>
  )
}

"use client"
import React, { useEffect, useState } from 'react'
import Header from './headers'
import Package from './packages'
import { useGetPackagesQuery } from '@/app/api/general'
import Cookies from 'js-cookie'
import Packages from './packages'
import { usePathname } from 'next/navigation'

export type PackageType = {
  price: string,
  period: string,
  post: string
  resume: string,
  refresh: string,
  adverstisement: string,
  contact: string,
  alert: string,
  meeting: string,
  chat: string,
  job_top?: string
}


export default function SubmitPackage({ target }: { target: any }) {
  const { data: packageData, isLoading } = useGetPackagesQuery(null)
  const [formattedData, setFormattedData] = useState<any>({});
  const path = usePathname();

  const packages: PackageType[] = [
    {
      price: "$299",
      period: `1`,
      post: "2",
      resume: "5",
      refresh: "3",
      adverstisement: '1',
      contact: "5",
      alert: "5",
      meeting: "5",
      chat: "3"
    },
    {
      price: "$799",
      period: `3`,
      post: "5",
      resume: "17",
      chat: "15",
      refresh: "15",
      adverstisement: '5',
      contact: "17",
      alert: "17",
      meeting: "17"
    },
    {
      price: "$1,299",
      period: `6`,
      chat: "35",
      post: "15",
      resume: "45",
      refresh: "45",
      adverstisement: '15',
      contact: "45",
      alert: "45",
      meeting: "45"
    },
    {
      price: "$1,599",
      period: `1`,
      chat: "35",
      post: "35",
      resume: "95",
      refresh: "95",
      adverstisement: '35',
      contact: "95",
      alert: "95",
      meeting: "95",
      job_top: "60"
    }
  ]

  const token = Cookies.get('token');
  var tokenRole;
  if (token) {
    tokenRole = JSON.parse(token)
  }


  useEffect(() => {
    if (!packageData) {
      return;
    }

    const item = packageData.data.Packages.employer.promotional;

    const data = {
      jobPostings: item.jobPostings != -1 ? item.jobPostings : 'Unlimited',
      downloadResumes: item.downloadResumes != -1 ? item.downloadResumes : 'Unlimited',
      automaticJobRefreshals: item.automaticJobRefreshals != -1 ? item.automaticJobRefreshals : 'Unlimited',
      refreshJobToTop: item.refreshJobToTop != -1 ? item.refreshJobToTop : 'Unlimited',
      dailyTalentsChatPerDay: item.dailyTalentsChatPerDay != -1 ? item.dailyTalentsChatPerDay : 'Unlimited',
      jobPostingAdverstiments: item.jobPostingAdverstiments != -1 ? item.jobPostingAdverstiments : 'Unlimited',
      viewTalentsContacts: item.viewTalentsContacts != -1 ? item.viewTalentsContacts : 'Unlimited',
      receiveTalentApplicationAlerts: item.receiveTalentApplicationAlerts != -1 ? item.receiveTalentApplicationAlerts : 'Unlimited',
      meetings: item.meetings != -1 ? item.meetings : 'Unlimited',
      months: item.months != -1 ? item.months : 'One Time',
      price: item.price ? item.price : 'Free',
    }

    setFormattedData({
      data: {
        EMPLOYER_PACKAGE: packageData.data.EMPLOYER_PACKAGE,
        TALENT_PACKAGE: packageData.data.TALENT_PACKAGE,
        Packages: {
          employer: {
            ...packageData.data.Packages.employer,
            promotional: data,
          },
          talent: packageData.data.Packages.talent,
        }
      }
    });
  }, [packageData])

  return (
    <section>
      <div className='mt-5'>
        {path !== '/candidate/packages' && <h3 className='text-xl font-semibold'>{target.update_package}</h3>}

        {
          tokenRole.data.type === 'talent' && (
            <>
              {path !== '/candidate/packages' && <h2 className='text-lg font-semibold mt-8'>For Candidates:</h2>}
              <div className='flex flex-wrap gap-5 mt-2'>
                {
                  formattedData.data && formattedData.data.TALENT_PACKAGE.map((pack: any, index: number) => <Packages packType={pack} plan={formattedData.data.Packages.talent[pack]} role={'talent'} target={target} key={index} />)
                }
              </div>
            </>
          )
        }

        {
          tokenRole.data.type === 'employer' && (
            <>
              {path !== '/employer/packages' && <h2 className='text-lg font-semibold mt-8'>For Employers:</h2>}
              <div className='flex flex-wrap gap-5 mt-2'>
                {
                  formattedData.data && formattedData.data.EMPLOYER_PACKAGE.map((pack: any, index: number) => <Packages packType={pack} plan={formattedData.data.Packages.employer[pack]} role={'employer'} target={target} key={index} />)
                }
              </div>
            </>
          )
        }
      </div>

    </section>
  )
}

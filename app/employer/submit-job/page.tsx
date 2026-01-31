"use client"
import SubmitForm from '@/components/submitForm';
import SubmitPackage from '@/components/submitPackage';
import React, { useContext, useEffect, useState } from 'react'
import lang from "@/app/employer/submit-job/page.json"
import { LanguageData } from '@/app/context';
import { useGetUserMutation } from '@/app/api/general';
import Cookies from 'js-cookie';
import Header from '@/components/headers';

const jsonData: any = lang;
export default function SubmitJobs() {
    const languageContext = useContext(LanguageData);
    const [submitId, { isLoading, data }] = useGetUserMutation();

    if (!languageContext) {
        throw new Error("LanguageData context is not provided!");
    }
    const [language, setLanguage] = languageContext;
    const target = jsonData[language]

    useEffect(() => {
        const token = Cookies.get('token');
        async function getUser(id: string) {
            try {
                const res = await submitId(id).unwrap();
                console.log(await res)
            } catch (err) {
                console.error(err)
            }
        }
        if (token) {
            const tokenId = JSON.parse(token);
            getUser(tokenId.data.id)
        }
    }, [])

    return (
        <section>
            {
                isLoading &&
                <section className='w-full h-[80lvh] top-0 z-50 flex items-center justify-center'>
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </section>
            }
            {
                data && data.data.package && !isLoading ? <SubmitForm target={target} /> : <SubmitPackage target={target} />
            }
        </section>
    )
}

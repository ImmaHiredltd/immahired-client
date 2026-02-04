import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://immahired.cn/api/';
export const apiSlice =  createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: API_URL,
        prepareHeaders: (headers: Headers) => {
            const token = Cookies.get('token');
            if(token){
              const parsedToken = JSON.parse(token);
              headers.set('Authorization', `Bearer ${parsedToken.token}`);
            }
            return headers;
          },
      
    } ),
    endpoints: (builder) => ({}),
    tagTypes: ['refreshUsers', 'statusUser', 'companyInfo', 'fetchJobs'],
})


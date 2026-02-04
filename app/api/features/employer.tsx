import { apiSlice } from "../service";

const employerSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createEmployerAccount: builder.mutation({
            query: (formData) => ({
                url: "/auth/createAccount",
                body: formData,
                method: "POST",
                formData: true, // This tells RTK Query to handle FormData properly
                prepareHeaders: (headers: any) => {
                    // Remove content-type to let browser set it with boundary
                    headers.delete('content-type');
                    return headers;
                },
            })
        }),
        createJob: builder.mutation({
            query: ({ data, objToken }) => ({
                url: '/jobs',
                body: { ...data },
                method: "POST",
                headers: {
                    Authorization: `Bearer ${objToken}`,
                }
            })
        }),
        getJobs: builder.query({
            query: () => ({
                url: '/jobs',
            }),
            providesTags: [{ type: 'fetchJobs', id: 'JOBS' }],
        }),
        getEmployer: builder.query({
            query: (id) => ({
                url: `/employers/${id}`,
            }),
            providesTags: [{ type: 'companyInfo', id: 'EMPLOYER' }],
        }),
        updateEmployer: builder.mutation({
            query: (formData) => ({
                url: `/employers`,
                method: 'PATCH',
                body: formData
            }),
            invalidatesTags: [{ type: 'companyInfo', id: 'EMPLOYER' }],
        }),
        updateJob: builder.mutation({
            query: ({ formData, id }) => ({
                url: `/jobs/${id}`,
                method: 'PATCH',
                body: { ...formData }
            }),
            invalidatesTags: [{ type: 'fetchJobs', id: 'JOBS' }],
        }),
        deleteJob: builder.mutation({
            query: (id) => ({
                url: `/jobs/${id}`,
                method: 'DELETE'
            })
        }),
        employerApplication: builder.mutation({
            query: (id) => ({
                url: `/jobs/${id}/applications`,
                method: 'GET'
            })
        }),
        approveApplication: builder.mutation({
            query: (id) => ({
                url: `/applications/${id}/approve`,
                method: 'POST'
            })
        }),
        rejectApplication: builder.mutation({
            query: (id) => ({
                url: `/applications/${id}/disapprove`,
                method: 'POST'
            })
        }),
        refreshJobs: builder.mutation({
            query: (id) => ({
                url: `/jobs/${id}/refreshToTop`,
                method: 'POST'
            })
        })
    })
})

export const { useCreateEmployerAccountMutation, useCreateJobMutation, useGetJobsQuery, useGetEmployerQuery, useUpdateEmployerMutation, useUpdateJobMutation, useDeleteJobMutation, useEmployerApplicationMutation, useApproveApplicationMutation, useRejectApplicationMutation, useRefreshJobsMutation } = employerSlice
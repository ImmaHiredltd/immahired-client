import ResetPassword from "../(auth)/auth/reset/page";
import { apiSlice } from "./service";

const generalEndpoint = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: (formData) => ({
                url: '/auth/login',
                method: 'POST',
                body: {...formData}
            })
        }),
        getJobs: builder.query({
            query: () => ({
                url: '/jobs',
            })
        }),
        getTalent: builder.mutation({
            query: (id) => ({
                url: `/talents/${id}`,
                method: 'GET',
            })
        }),
        getUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'GET',
            }),
            providesTags: [{ type: 'refreshUsers', id: 'LIST'}],
        }),
        getMe: builder.query({
            query: (id) => ({
                url: `/users/${id}`
            }),
            providesTags: [{ type: 'refreshUsers', id: 'LIST'}, {type: 'statusUser', id: 'STATUS'}],
        }),
        getJob: builder.query({
            query:(id) => ({
                url: `/jobs/${id}`,
                method: 'GET'
            })
        }),
        saveJob: builder.mutation({
            query: (id) => ({
                url: `/jobs/save/${id}`,
                method: 'POST'
            })
        }),
        unsaveJob: builder.mutation({
            query: (id) => ({
                url: `/jobs/unsave/${id}`,
                method: 'DELETE'
            })
        }),
        editProfile: builder.mutation({
            query: ({id, formData}) => ({
                url: `/users/${id}`,
                body: formData,
                method: "PATCH",
                formData: true, // This tells RTK Query to handle FormData properly
                prepareHeaders: (headers) => {
                    // Remove content-type to let browser set it with boundary
                    headers.delete('content-type');
                    return headers;
                },
            }),
            invalidatesTags: [{ type: 'refreshUsers', id: 'LIST' }],
        }),
        getPackages: builder.query({
            query: () => ({
                url: `/packages`,
                method: 'GET'
            })
        }),
        payForPackage: builder.mutation({
            query: (data) => ({
                url: `/subscriptions/create-checkout-session`,
                method: 'POST',
                body: {...data}
            })
        }),
        changPassword: builder.mutation({
            query: (data) => ({
                url: `/auth/changePassword`,
                method: 'POST',
                body: {...data}
            })
        }),
        getPackageStatus: builder.query({
            query: () => ({
                url: `/packages/status`
            })
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: '/auth/forgotPassword',
                body: {...data},
                method: 'POST'
            })
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: '/auth/resetPassword',
                body: {...data},
                method: 'POST'
            })
        }),
        getContacts: builder.query({
            query: () => ({
                url: `/chats/contacts`,
                method: 'GET'
            })
        }),
        getPreviousMessages: builder.mutation({
            query: (id) => ({
                url: `/chats/${id}`,
                method: 'GET'
            })
        }),
        upGradePackage: builder.mutation({
            query: (data) => ({
                url: `/subscriptions/create-portal-session`,
                body: {...data},
                method: 'POST'
            }),
        }),
        getNotifications: builder.query({
            query: () => ({
                url: '/notifications'
            })
        }),
        getCandidates: builder.query({
            query: () => ({
                url: `/talents`,
                method:'GET'
            })
        }),
        getVerifyMail: builder.mutation({
            query: (token) => ({
                url: `/auth/verify`,
                method: 'POST',
                body: {...token}
            })
        }),
        approveUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}/approve`,
                method: 'PATCH'
            }),
            invalidatesTags: [{ type: 'statusUser', id: 'STATUS' }, { type: 'statusAdmin', id: 'ADMIN' }],
        }),
        disapproveUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}/disapprove`,
                method: 'PATCH'
            }),
            invalidatesTags: [{ type: 'statusUser', id: 'STATUS' }, { type: 'statusAdmin', id: 'ADMIN' }],
        }),
        getAnalytics: builder.query({
            query: () => ({
                url: `/users/dashboard`
            })
        }),
        getEmployers: builder.query({
            query: () => ({
                url: '/employers'
            })
        }),
        getAdmins: builder.query({
            query: () => ({
                url: '/users/admins',
                method: 'GET'
            }),
            providesTags: [{ type: 'statusAdmin', id: 'ADMIN' }]
        }),
        getAllUsers: builder.query({
            query: () => ({
                url: '/users'
            })
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: [
                { type: 'refreshUsers', id: 'LIST' }, 
                { type: 'statusUser', id: 'STATUS' }, 
                { type: 'statusAdmin', id: 'ADMIN' }
            ],
        }),    
        jobViews: builder.query({
            query: (id) => ({
                url: `/jobs/views/${id}`,
            })
        }),    
    })
})

export const { useLoginMutation, useGetJobsQuery, useGetTalentMutation, useGetUserMutation, useEditProfileMutation, useGetJobQuery, useSaveJobMutation, useUnsaveJobMutation, useGetPackagesQuery, usePayForPackageMutation, useChangPasswordMutation, useGetPackageStatusQuery, useForgotPasswordMutation, useResetPasswordMutation, useGetContactsQuery, useGetPreviousMessagesMutation, useUpGradePackageMutation, useGetNotificationsQuery, useGetMeQuery, useGetCandidatesQuery, useGetVerifyMailMutation, useApproveUserMutation, useDisapproveUserMutation, useGetAnalyticsQuery, useGetEmployersQuery, useGetAdminsQuery, useGetAllUsersQuery, useDeleteUserMutation, useJobViewsQuery } = generalEndpoint
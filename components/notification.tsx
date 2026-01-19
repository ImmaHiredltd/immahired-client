"use client"
import { useGetNotificationsQuery } from '@/app/api/general'
import React, { useEffect, useState } from 'react'
import { FaBell, FaEnvelope } from 'react-icons/fa';
import { Socket, io } from 'socket.io-client';
import Cookies from 'js-cookie';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import ChatNot from './chatNot';
import moment from 'moment';



export default function Notifications({target}: {target: any}){
  const { data, isLoading } = useGetNotificationsQuery(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [ notification, setNotification ] = useState([]);

  useEffect(() => {
    const tokenData = Cookies.get('token'); 
    
        if (tokenData) {
          const {token} = JSON.parse(tokenData);
          
          if(token) {
            const newSocket = io('https://35.183.137.84.nip.io/', {
                auth: {
                    token, 
                },
            });

            setSocket(newSocket);
            // console.log("Mes: ", messages)

            // Initialize socket event listeners
            socketInitailization(newSocket);
        }
      }
  },[])

  useEffect(() => {
    setNotification(data?.data)
  }, [data])

  const socketInitailization = (socket: Socket) => {
      socket.on('notification', (data: any) => {
        setNotification((prevMessages: any) => {
          // Check if the incoming message already exists in the array
          const messageExists = prevMessages.some((notify: any) => notify.createdAt === data.createdAt);
      
          // Only add the new message if it doesn't already exist
          if (!messageExists) {
              return [...prevMessages, data];
          }
          
          return prevMessages; // Return the existing state if the message is a duplicate
      });
      
      })
  };


  return (
    <>
      <div className='w-full sm:block hidden sm:w-[80%] lg:w-[30%] space-y-3 h-[388px] rounded-xl shadow-md shadow-gray-400 bg-main/50 p-5'>
        <h2 className='text-xl'>{target.notification}</h2>
        <hr className='border border-gray-400' />

        <div className='flex flex-col gap-3 overflow-y-screen  h-[80%] overflow-y-scroll'>
            {
              notification && notification.map((notify: any, index: number) => notify.type === 'chat' ? <ChatNot key={index} obj={notify} /> 
              :  
              <div key={index} className='text-xs py-2 border-b-2 sm:border-gray-500/50 border-gray-200'>
                <div className='flex gap-2 items-center '>
                    <FaBell />
                    <span>{notify.type} {notify.status}</span>
                </div>
                <span className='text-[10px] flex justify-end '>{moment(notify.createdAt).format('Do MMM hh:mma')}</span>
            </div>
            )
            }
            {
              notification.length === 0 && !isLoading && <div className='text-center text-sm mt-10 text-muted'>{target.no_notification}</div>
            }
        </div>
      </div>
      <Sheet>
          <SheetTrigger className='absolute z-50 right-5 bottom-5 sm:hidden block bg-white shadow-lg shadow-black/50 rounded p-3'><FaBell /></SheetTrigger>
          <SheetContent className='text-left'>
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
              <SheetDescription className='flex flex-col gap-3 text-sm'>
                {
                  notification && notification.map((notify: any, index: number) => notify.type === 'chat' ? <ChatNot key={index} obj={notify} /> : 
                  <div key={index} className='text-sm border-b-2 sm:border-gray-500/50 border-gray-200'>
                      <div className='flex gap-2 items-center '>
                          <FaBell />
                          <span>{notify.type} {notify.status}</span>
                      </div>
                      <span className='text-[8px] flex justify-end '>{moment(notify.createdAt).format('Do MMM hh:mma')}</span>
                  </div>
                )
                }
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
      </Sheet>
    </>
  )
}

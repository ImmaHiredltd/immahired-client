"use client"
import { Section } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import Cookies from 'js-cookie'
import { headers } from 'next/headers'
import { FaArrowCircleLeft, FaPhoneAlt } from 'react-icons/fa'
import moment from 'moment'
import { TiUserOutline } from 'react-icons/ti'

import Image from 'next/image'
import { IoSendSharp } from 'react-icons/io5'
import { useGetPreviousMessagesMutation } from '@/app/api/general'
import { useRouter } from 'next/navigation'
interface ChatMessage {
    receiver: string;
    sender: string;
    text: string;
    timestamp: any
  }


export default function Chat() {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [ submitData, { data:prevData } ] = useGetPreviousMessagesMutation()
    const [ message, setMessage ] = useState('')
    const [input, setInput] = useState('');
    const [receiverData, setReceiverData] = useState<any>()
    const [ senderId, setSenderId ] = useState('');
    const [receiver, setReceiver] = useState(''); // Assuming you set the receiver somewhere
    const chatScroll = useRef<any>(null);

    const route = useRouter();

  
    useEffect(() => {
      async function loadThis(){
        const tokenData = Cookies.get('token');
        const user_data = localStorage.getItem('profile');
        if(user_data){
          const user_id = JSON.parse(user_data);
          setReceiverData(user_id)
          setReceiver(user_id.id);
          try{
            const res = await submitData(user_id.id).unwrap()
            if(await res){
              setMessages(res.data)
            }
          }catch(err){
            console.error(err)
          }
        }
        if (tokenData) {
        const {token} = JSON.parse(tokenData);
        const { data } = JSON.parse(tokenData); 
        setSenderId(data.id)

        if (token) {
            const newSocket = io('https://immahired.cn', {
                auth: {
                    token, 
                },
                path: '/api/socket.io',
            });

            setSocket(newSocket);
            console.log("Me: ", token);

            // Initialize socket event listeners
            socketInitailization(newSocket);
        }
      }
    }
    loadThis()

    }, []);

    // console.log(socket)

    const socketInitailization = (socket: Socket) => {
      socket.on('chat', (message: ChatMessage) => {
        setMessages((prevMessages: ChatMessage[]) => {
          // Check if the incoming message already exists in the array
          const messageExists = prevMessages.some(msg => msg.timestamp === message.timestamp);
    
          // Only add the new message if it doesn't already exist
          if (!messageExists) {
            return [...prevMessages, message];
          }
          return prevMessages; // Return the existing state if the message is a duplicate
        });
      });
    };
    

    useEffect(() => {
        chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
    }, [messages])


  
    const sendMessage = () => {
      if (message && socket){
        const messageData = {
          receiver,
          text: message
        };
        setMessage('')
        socket.emit('chat', messageData);
        setInput(''); 
        console.log("Message: ",messages)
      }
    };

    const goBack = () => {
      window.history.back()
    }
  
    return (
      <section className=''>
        <button onClick={goBack} className='flex gap-2 items-center mb-5 font-semibold'><FaArrowCircleLeft /> Back</button>
        <h2 className='text-[1.5rem] font-semibold'>Chat</h2>

        <div className='bg-gray-300 p-5 sm:p-10 rounded-xl shadow-sm shadow-gray-400 h-[80vh] w-full sm:w-1/2 relative'>
            <div className='flex items-center justify-between'>
              <div className='flex gap-2 items-center'>
                  <div className='relative h-16 w-16 shadow-md shadow-gray-400 rounded-full overflow-hidden'>
                    <Image 
                      fill
                      src={receiverData?.image.url}
                      alt={'Profile image'}
                      className='object-cover'
                    />
                  </div>
                  <div className='flex flex-col font-semibold'>
                    <span className='text-sm'>{receiverData && receiverData?.lastName} {receiverData && receiverData?.name}</span>
                    <span className='text-xs'>{receiverData?.email}</span>
                  </div>
              </div>

              <div className='text-gray-700 hover:text-gray-500 rounded-full p-3  '>
                  <a href={`tel:${receiverData?.phoneNumber}`}><FaPhoneAlt /></a>
              </div>
            </div>

            <div className='text-sm h-[80%] py-5 relative'>
                <div ref={chatScroll} className='mb-10 h-[90%] px-2 overflow-y-scroll'>
                    {
                      messages.map((datum: any, index:number) => 
                        <p key={index} className={`${ senderId === datum.sender ? 'bg-white ml-auto' : 'bg-main text-white mr-auto' } my-5 min-w-[90px] max-w-[250px] flex flex-col shadow-xl rounded-xl px-5 py-2  w-fit `}>
                          <span className='text-[10px]'>{senderId === datum.sender ? 'You' : receiverData?.name}</span>
                          <span className='text-sm'>{datum.text}</span>
                          <span className='text-[10px]'>{moment(datum.timestamp || datum.createdAt).format('hh:mma MMM Do')}</span>
                        </p>
                      )
                    }
                </div>
                
                <div className='flex justify-between absolute bottom-0 w-full'>
                    <input placeholder='Type here...' type="text" value={message} onChange={(e: any) => setMessage(e.target.value)} className='bg-transparent border-b-2 border-main/30 w-[85%] focus:outline-none focus:border-main' />
                    <button onClick={sendMessage} className='p-3 rounded-full bg-main text-white'><IoSendSharp /></button>
                </div>
            </div>
        </div>
      </section>
    );
  
}

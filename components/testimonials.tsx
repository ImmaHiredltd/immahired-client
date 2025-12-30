
import Image from 'next/image'
import React from 'react'
import img1 from "@/public/images/one.jpg"
import img2 from "@/public/images/two.jpg"
import img3 from "@/public/images/three.jpg"
import { motion } from 'framer-motion'
import { ImQuotesRight } from "react-icons/im";


export default function Testimonial({ target }: any) {

    const testimonials = [
        {
          picture: img1,
          testimony: target.test_person1_testimony,
          name: "John Jonz"
        },
        {
          picture: img2,
          testimony: target.test_person2_testimony,
          name: "Helen George"
        },
        {
          picture: img3,
          testimony: target.test_person3_testimony,
          name: "Mike Bruce"
        },
      ]
  return (
    <div className="px-banner-clamp py-5 space-y-5 sm:space-y-10 ">
            <motion.h1
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4 }}
              className="sm:text-4xl text-2xl font-bold text-center w-full sm:w-[30%] flex mx-auto">{target.test_header}</motion.h1>

        <div className="flex sm:flex-row flex-col max-sm:gap-8 justify-between">
            {
                testimonials.map((testimony, index) => {
                return(
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="w-full sm:w-[30%] bg-abstract shadow-xl shadow-black text-white rounded-lg p-5 space-y-3">
                        <div className="space-y-3 text-sm font-semibold relative">
                          <div className='absolute top-2 text-gray-400 right-5 text-4xl'>
                            <ImQuotesRight />
                          </div>
                          <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full shadow-sm shadow-black overflow-hidden">
                              <Image
                              alt="Profile Image"
                              src={testimony.picture}
                              className="object-cover"
                              fill
                              />
                          </div>
                          <h2>{testimony.name}</h2>
                        </div>
                        <div className="text-xs">
                          {testimony.testimony}
                        </div>
                    </motion.div>
                )
                })
            }
        </div>
    </div>
  )
}

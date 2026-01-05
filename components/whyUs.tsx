import React from 'react'
import { AnimatePresence, motion } from "framer-motion"
import { HiUserGroup } from 'react-icons/hi2'
import { MdVerifiedUser } from 'react-icons/md'
import { FaChartLine } from 'react-icons/fa'
import { VscWorkspaceTrusted } from 'react-icons/vsc'


export default function WhyUs() {

    const Why = ({ icon, title, details }: any) => {
      return (
        <motion.div
          className="sm:w-[30%] w-full btn-sweep py-7 sm:py-14 px-5 sm:px-10 rounded-xl bg-white space-y-5 ease-in-out duration-500 hover:bg-main hover:text-white"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="text-2xl sm:text-4xl p-3 w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center text-white bg-main hover:bg-white rounded-full">
            {icon}
          </p>
    
          <p className="text-xl sm:text-2xl font-black">{title}</p>
    
          <p>{details}</p>
        </motion.div>
      );
    };
    

      const whyChooseUs = [
        {
          iconSvg: <HiUserGroup />,
          title: 'Retain Top Talent',
          details: "Providing clear career paths and growth opportunities is key to retaining top talent."
        },
        {
          iconSvg: <MdVerifiedUser />,
          title: 'Stay Compliant',
          details: "Educate employees about compliance requirements through regular training"
        },
        {
          iconSvg: <FaChartLine />,
          title: 'Improve Employee',
          details: "Invest in employee training development programs enhance skill and knowledge."
        }
      ]
    
  return (
    <>
        {/* Background Circle with smooth animation */}
                        <motion.div
                          className="absolute w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] rounded-full right-20 sm:-bottom-52 bg-main/20"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                        />
        
                        <motion.div
                          className="w-full h-[125vh] sm:h-full backdrop-blur-3xl py-10 px-5 sm:px-20 flex flex-col items-center space-y-5 sm:space-y-14 justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1.5 }}
                        >
                          <motion.div
                            className="text-3xl sm:text-5xl"
                            initial={{ y: -50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                          >
                            <VscWorkspaceTrusted />
                          </motion.div>
        
                          <motion.h2
                            className="text-2xl sm:text-5xl font-black"
                            initial={{ y: -50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          >
                            Why Choose Us
                          </motion.h2>
        
                          <div className="flex sm:flex-row flex-col justify-evenly w-full gap-8">
                            {whyChooseUs &&
                              whyChooseUs.map((item, i) => (
                                <Why
                                  key={i}
                                  icon={item.iconSvg}
                                  title={item.title}
                                  details={item.details}
                                />
                              ))}
                          </div>
                        </motion.div>
    </>
  )
}

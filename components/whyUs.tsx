import React from 'react'
import { motion } from "framer-motion"
import { HiUserGroup } from 'react-icons/hi2'
import { MdVerifiedUser } from 'react-icons/md'
import { FaChartLine } from 'react-icons/fa'
import { VscWorkspaceTrusted } from 'react-icons/vsc'


export default function WhyUs({ target }: any) {

    const Why = ({ icon, title, details }: any) => {
      return (
        <motion.div
          className="xl:w-full w-full btn-sweep py-7 sm:py-8 px-5 sm:px-10 rounded-xl bg-white space-y-5 ease-in-out duration-500 hover:bg-main hover:text-white"
          
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="text-2xl max-[380px]:text-xl max-[380px]:p-2 sm:text-4xl p-3 w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center text-white bg-main hover:bg-white rounded-full">
            {icon}
          </p>
    
          <p className="text-xl max-[380px]:text-sm sm:text-2xl font-black">{title}</p>
    
          <p className='max-[380px]:text-xs'>{details}</p>
        </motion.div>
      );
    };
    

      const whyChooseUs = [
        {
          iconSvg: <HiUserGroup />,
          title: target.why_us_title_1,
          details: target.why_us_details_1
        },
        {
          iconSvg: <MdVerifiedUser />,
          title: target.why_us_title_2,
          details: target.why_us_details_2
        },
        {
          iconSvg: <FaChartLine />,
          title: target.why_us_title_3,
          details: target.why_us_details_3
        }
      ]
    
  return (
    <>  
                        <motion.div
                          className="w-full 2xl:h-fit 2xl:max-w-[2300px] 2xl:mx-auto sm:h-full py-10 px-5 sm:px-20 flex flex-col items-center space-y-5 sm:space-y-14 justify-center"
                        >
                          <motion.div
                            className="text-3xl max-[380px]:text-2xl sm:text-5xl"
                            initial={{ y: -50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                          >
                            <VscWorkspaceTrusted />
                          </motion.div>
        
                          <motion.h2
                            className="max-[380px]:text-xl text-2xl sm:text-5xl font-black"
                            initial={{ y: -50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          >
                            {target.why_us}
                          </motion.h2>
        
                          <div className="grid grid-cols-1 xl:grid-cols-3 w-full gap-8">
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

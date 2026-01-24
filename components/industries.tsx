import React, { useState } from 'react'
import { motion } from "framer-motion"
import { useMediaQuery } from 'react-responsive';
import { FaCode } from 'react-icons/fa';
import { RiRobot3Fill } from 'react-icons/ri';
import { MdEngineering, MdHealthAndSafety } from 'react-icons/md';
import { GiHealthNormal } from 'react-icons/gi';
import { TbRibbonHealth } from 'react-icons/tb';
import { BsClipboardData } from 'react-icons/bs';
import { HiAcademicCap } from 'react-icons/hi2';




export default function Industries({ target, isMobileWidth, isMobileHeight }: any) {
  const industries = [
  {
    title: target.industry_1,
    icon: <FaCode />,
    industries: [
      target.industry_1_1,
      target.industry_1_2,
      target.industry_1_3,
      target.industry_1_4,
      target.industry_1_5,
    ],
  },
  {
    title: target.industry_3,
    icon: <RiRobot3Fill />,
    industries: [
      target.industry_2_1,
      target.industry_2_2,
      target.industry_2_3,
      target.industry_2_4,
      target.industry_2_5,
    ],
  },
  {
    title: target.industry_2,
    icon: <MdHealthAndSafety />,
    industries: [
      target.industry_3_1,
      target.industry_3_2,
      target.industry_3_3,
      target.industry_3_4,
    ],
  },
  {
    title: target.industry_6,
    icon: <GiHealthNormal />,
    industries: [
      target.industry_6_1,
      target.industry_6_2,
      target.industry_6_3,
      target.industry_6_4,
      target.industry_6_5,
    ],
  },
  {
    title: target.industry_7,
    icon: <TbRibbonHealth />,
    industries: [
      target.industry_7_1,
      target.industry_7_5,
      target.industry_7_2,
      target.industry_7_4,
      target.industry_7_3,
    ],
  },
  {
    title: target.industry_8,
    icon: <MdEngineering />,
    industries: [
      target.industry_8_1,
      target.industry_8_2,
      target.industry_8_3,
      target.industry_8_4,
      target.industry_8_5,
    ],
  },
  {
    title: target.industry_4,
    icon: <BsClipboardData />,
    industries: [
      target.industry_4_1,
      target.industry_4_2,
      target.industry_4_3,
      target.industry_4_4,
      target.industry_4_5,
    ],
  },
  {
    title: target.industry_5,
    icon: <HiAcademicCap />,
    industries: [
      target.industry_5_1,
      target.industry_5_2,
      target.industry_5_3,
      target.industry_5_4,
    ],
  },
];
    const isMobile = useMediaQuery({ maxWidth: 640 })
    const [showAll, setShowAll] = useState(false);
    const visibleIndustries = (showAll || isMobile) ? industries : industries.slice(0, 8);

  return (
    <section className={`max-w-7xl mx-auto px-6 max-[380px]:text-xs ${isMobileHeight && isMobileWidth ? "py-16" : "py-16"}`}>
                  {/* Heading */}
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`text-center max-[380px]:text-2xl sm:text-5xl font-black mb-4 ${isMobileHeight && isMobileWidth ? "text-xl" : "text-4xl"} `}
                  >
                    {target.explore_industries}
                  </motion.h2>

                  <p className="text-center text-gray-600 max-w-2xl mx-auto max-[380px]:text-xs mb-16 max-sm:text-sm">
                    {target.we_serve_various_industries_text}
                  </p>

                  {/* Grid */}
                  <div className="grid grid-cols-1 max-[380px]:gap-5 md:grid-cols-2 xl:grid-cols-4 gap-10">
                    {visibleIndustries.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="
                          group relative h-[260px] rounded-xl
                          bg-white/80 backdrop-blur-xl
                          border border-gray-200/60
                          shadow-[0_8px_24px_rgba(0,0,0,0.06)]
                          transition-all duration-500 ease-out
                          hover:-translate-y-[2px]
                          hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]
                          overflow-hidden
                        "
                      >
                        {/* Top accent */}
                        <span
                          className="
                            absolute top-0 left-0 h-[3px] w-0
                            bg-main transition-all duration-500
                            group-hover:w-full
                          "
                        />

                        {/* Header */}
                        <div className="relative z-20 px-6 pt-6 pb-2">
                          <h3 className="sm:text-lg text-xl font-semibold tracking-tight text-gray-100 group-hover:text-main transition-colors">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-400">
                            {target.industries}
                          </p>
                        </div>

                        {/* Icon placeholder */}
                        <div
                          className="
                            absolute inset-0 z-10
                            bg-gradient-to-br from-black to-gray-800
                            flex items-end justify-center pb-10
                            text-main/20 text-9xl
                            transition-all duration-500 ease-out
                            group-hover:opacity-0
                            group-hover:scale-90
                            pointer-events-none
                          "
                        >
                          {item.icon}
                        </div>

                        {/* Reveal panel */}
                        <div
                          className="
                            absolute inset-x-0 bottom-0 z-20
                            bg-main text-white
                            px-6 py-4
                            translate-y-full
                            transition-transform duration-500 ease-out
                            group-hover:translate-y-0
                          "
                        >
                          <ul className="space-y-2">
                            {item.industries.map((industry, i) => (
                              <li
                                key={i}
                                className="
                                  flex items-start gap-2 text-xs
                                  opacity-0 translate-y-1
                                  transition-all duration-400 ease-out
                                  group-hover:opacity-100
                                  group-hover:translate-y-0
                                "
                                style={{ transitionDelay: `${i * 60}ms` }}
                              >
                                <span className="mt-[5px] w-1 h-1 rounded-full bg-white/80" />
                                <span className="leading-snug">{industry}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Show More / Less */}
                  {/* {industries.length > 6 && !isMobile && (
                    <div className="flex justify-center mt-16">
                      <button
                        onClick={() => setShowAll(!showAll)}
                        className="
                          px-10 py-4 rounded-full
                          btn-sweep
                          bg-main text-white font-semibold
                          tracking-wide
                          transition-all duration-300
                          hover:shadow-lg hover:-translate-y-[1px]
                        "
                      >
                        {showAll ? "Show Less" : "Show More"}
                      </button>
                    </div>
                  )} */}
                </section>
  )
}

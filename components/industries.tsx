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

const industries = [
  {
    title: "High-Tech & AI",
    icon: <FaCode />,
    industries: [
      "Artificial Intelligence",
      "Machine Learning",
      "Tech Startups",
      "Software Development",
      "Cybersecurity",
    ],
  },
  {
    title: "Robotics",
    icon: <RiRobot3Fill />,
    industries: [
      "Robotics Manufacturing",
      "Automation",
      "Smart Manufacturing",
      "Industrial Automation",
      "R&D",
    ],
  },
  {
    title: "Environmental Health & Safety (EHS)",
    icon: <MdHealthAndSafety />,
    industries: [
      "Environmental Consulting",
      "Sustainability",
      "Government & NGOs",
      "Energy & Manufacturing",
    ],
  },
  {
    title: "Medical & Healthcare",
    icon: <GiHealthNormal />,
    industries: [
      "Hospitals & Clinics",
      "Medical Devices",
      "Digital Health",
      "Biotechnology",
      "Public Health",
    ],
  },
  {
    title: "Pharmaceutical",
    icon: <TbRibbonHealth />,
    industries: [
      "Pharmaceuticals",
      "Biotech",
      "Drug Discovery",
      "Clinical Research",
      "Regulatory Affairs",
    ],
  },
  {
    title: "Mechanical & Electrical Engineering",
    icon: <MdEngineering />,
    industries: [
      "Automotive",
      "Aerospace & Defense",
      "Energy",
      "Manufacturing",
      "Robotics & Automation",
    ],
  },
  {
    title: "Data Science",
    icon: <BsClipboardData />,
    industries: [
      "AI & Software",
      "Healthcare Analytics",
      "Finance & Fintech",
      "E-commerce",
      "Social Media Analytics",
    ],
  },
  {
    title: "Research & Academia",
    icon: <HiAcademicCap />,
    industries: [
      "Universities",
      "Research Institutes",
      "Innovation Labs",
      "Think Tanks & NGOs",
    ],
  },
];


export default function Industries() {
    const isMobile = useMediaQuery({ maxWidth: 640 })
    const [showAll, setShowAll] = useState(false);
    const visibleIndustries = (showAll || isMobile) ? industries : industries.slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
                  {/* Heading */}
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center text-4xl sm:text-5xl font-black mb-4"
                  >
                    Industries We Serve
                  </motion.h2>

                  <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16 max-sm:text-sm">
                  <b>IMMA HIRED</b> specializes in recruiting top talent with MBA, Masters, and PhD degrees from QS-ranked universities across a range of cutting-edge industries. These include High-Tech, AI, Robotics, Environmental Health and Safety, Medical, Pharmaceutical, Mechanical and Electrical Engineering, Data Science, and Research. We connect businesses with exceptional graduates who are shaping the future of these dynamic fields.
                  </p>

                  {/* Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
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
                            Industries
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

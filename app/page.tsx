"use client"
import Image from "next/image";
import pageLanguage from "@/app/page.json"
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import Cookies from 'js-cookie'
import { FaChartLine, FaCode, FaRegDotCircle, FaSearch } from "react-icons/fa";
import { useContext, useState, useRef, useEffect } from "react";
import { LanguageData } from "./context";
import Testimonial from "@/components/testimonials";
import Navbar from "@/components/nav";
import Footer from "@/components/footer";
import { useGetJobsQuery } from "./api/general";
import { UserData } from "./tokenContext";
import { toast, ToastContainer } from "react-toastify";
import { FaArrowTrendUp } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from 'typewriter-effect';
import { GrUserWorker } from "react-icons/gr";
import { BsBuildingsFill, BsClipboardData } from "react-icons/bs";
import { RiRobot3Fill } from "react-icons/ri";
import { MdEngineering, MdHealthAndSafety, MdVerifiedUser } from "react-icons/md";
import { GiHealthNormal } from "react-icons/gi";
import { TbRibbonHealth } from "react-icons/tb";
import { HiAcademicCap, HiUserGroup } from "react-icons/hi2";
import { useMediaQuery } from "react-responsive";
import { FaPlay, FaPause } from "react-icons/fa"
import { PiCheckCircleFill } from "react-icons/pi";
import { VscWorkspaceTrusted } from "react-icons/vsc";

const StoryPoint = ({
  index,
  title,
  text,
  insight
}: {
  index: string;
  title: string;
  text: string;
  insight: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="
      group
      relative
      sm:ml-[45vw] m-5
      sm:mt-[20vh]
      sm:max-w-xl
      min-h-[400px]
      rounded-2xl
      perspective-[1200px]
    "
  >
    {/* FRONT PAGE */}
    <div
      className="
        relative
        h-full
        bg-white/70
        backdrop-blur-xl
        rounded-2xl
        px-5 sm:px-8 py-12
        flex flex-col justify-center gap-3
        shadow-2xl
        text-black
        transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]
        group-hover:-rotate-y-12
        group-hover:translate-x-[-12px]
      "
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="flex justify-between">
        <p className="text-xl bg-abstract w-16 h-16 flex items-center justify-center rounded-full font-bold text-white tracking-widest">
          {index}
        </p>
        <img
            src="/images/logo-1-removebg-preview.png"
            className="w-20 h-20 max-sm:hidden"
          />
      </div>
      
      <h3 className="text-2xl font-bold mt-4">{title}</h3>
      <p className="text-sm sm:text-base text-black/80 mt-4 leading-relaxed">
        {text}
      </p>
    </div>

    {/* BACK PAGE / SLIDING ELEMENT */}
    <div
      className="
        absolute inset-0
        rounded-2xl
        bg-main text-white
        px-8 py-12
        flex flex-col justify-center
        shadow-xl
        opacity-0
        translate-x-10
        rotate-y-[-20deg]
        transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)]
        group-hover:opacity-100
        group-hover:translate-x-0
        group-hover:rotate-y-0
      "
      style={{ transformStyle: "preserve-3d" }}
    >
      <h4 className="text-sm uppercase tracking-widest opacity-70">
        Insight
      </h4>
      <p className="text-2xl font-bold mt-4 leading-snug">
        {insight}
      </p>
    </div>
  </motion.div>
);

const WhyUs = ({ icon, title, details }: any) => {
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


type LanguageContextType = [string, (language: string) => void];

export default function Home() {
  
  const { data } = useGetJobsQuery(null);
  const parallaxRef = useRef<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [ active, setActive ] = useContext(UserData)
  const token = Cookies.get('token');
    var tokenData: any;
    if(token){
      tokenData = JSON.parse(token);
  }

 const languageContext = useContext(LanguageData);

if (!languageContext) {
  throw new Error("LanguageData context is not provided!");
}
const jsonData: any = pageLanguage;

const isMobile = useMediaQuery({ maxWidth: 640 })

useEffect(() => {
  const container = parallaxRef.current?.container?.current;
  if (!container) return;

  const onScroll = () => {
    setIsScrolled(container.scrollTop > 40);
  };

  container.addEventListener("scroll", onScroll);
  console.log(isScrolled)
  return () => container.removeEventListener("scroll", onScroll);
}, []);

const [language, setLanguage] = languageContext;
  const target: any = jsonData[language]

  const [showAll, setShowAll] = useState(false);
  const visibleIndustries = (showAll || isMobile) ? industries : industries.slice(0, 6);


  const industriesMarquee = [
    "High Tech", "Environmental Health", "Robotics", "Data Science", "Researchers",
    "Medical Fields", "Pharmaceutical", "Mechanical Engineering", "Electrical Engineering"
  ]

  const handleHire = () => {
    // if logged in and admin/employer
    if(active && (tokenData.data.type === 'employer' || tokenData.data.type === 'admin')){
        window.location.href = ('/candidates');
    }else{
        window.location.href = ('/login')
    }
  }

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      // Optional fullscreen
      if (video.requestFullscreen) {
        await video.requestFullscreen()
      }

      video.muted = false
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

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
        <section className="w-full">
        <Navbar isScrolled={isScrolled} />
        <ToastContainer />
            <Parallax ref={parallaxRef} pages={isMobile ? 16 : 11.7} 
              style={{backgroundImage: "url('/images/abstract_background_with_a_low_poly_design_0107.jpg')" }}
              className="w-full bg-cover bg-center bg-no-repeat relative"
            >
              {/* Banner */}
              <ParallaxLayer offset={0} speed={0.2}>
                <div  
                  className="bg-cover bg-center bg-no-repeat w-screen opacity- h-screen flex flex-col justify-center items-center" 
                  style={{backgroundImage: "url('/images/abstract_background_with_a_low_poly_design_0107.jpg')" }}
                >
                </div>
              </ParallaxLayer>

              {/* marguee */}
              <ParallaxLayer offset={0} speed={0} className="flex items-end">
                <div className="marquee-wrapper bg-abstract sm:-rotate-2 sm:p-10 sm:bottom-10 sm:-translate-x-2 text-white p-8 sm:w-[105vw]">
                  <div className="marquee-track">
                    <span className="flex gap-20">
                      {industriesMarquee && industriesMarquee.map ((i, _) => <span key={_} className="flex gap-20 items-center">{i} <FaRegDotCircle className="max-sm:hidden" /></span>)} 
                    </span>
                    <span className="flex gap-10">
                      {industriesMarquee && industriesMarquee.map ((i, _) => <span key={_} className="flex gap-20 items-center">{i}  <FaRegDotCircle className="max-sm:hidden" /></span>)}
                    </span>
                  </div>
                </div>
              </ParallaxLayer>

              <ParallaxLayer offset={0} speed={0.5} className="text-center flex items-center flex-col justify-center gap-8">
                <motion.p 
                  initial={{ opacity: 0, y: 100}}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 18,
                    delay: 0.3
                  }}
                  viewport={{ once: true }}
                  className=" sm:max-w-[60%] font-black max-sm:px-10">
                    <span className="text-6xl max-sm:text-2xl">{target.h1}</span>
                    <div className="text-black text-6xl max-sm:text-2xl">
                      <Typewriter
                        options = {{
                          strings: [target.h1_add, target.h1_add2],
                          autoStart: true,
                          loop: true,
                          cursor: ""
                        }}
                      />
                    </div>
                  </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: -100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 18,
                    delay: 0.5
                  }}
                className="text-xl font-bold max-sm:text-sm max-sm:px-10 sm:max-w-[55%]">
                  {target.p_banner}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 18,
                    delay: 0.8
                  }}
                  className="flex sm:flex-row flex-col max-sm:justify-center max-sm:items-center gap-4">
                  <button
                    onClick={() => window.location.href = "/jobs"}
                    className="
                      btn-sweep
                      bg-white
                      relative
                      sm:px-8 px-10 py-5
                      w-fit
                      rounded-full
                      text-sm font-semibold tracking-wide
                      border border-black/20
                      transition-all duration-300 ease-out
                      hover:border-black
                      hover:shadow-lg
                      hover:-translate-y-[1px]
                      flex gap-2 items-center justify-center
                    "
                  >
                    <span>Find Jobs</span>
                    <FaArrowTrendUp className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={handleHire}
                    className="
                      btn-sweep
                      relative
                      sm:px-8 px-16 py-5
                      rounded-full
                      w-fit
                      text-sm font-semibold tracking-wide
                      bg-main text-white
                      transition-all duration-300 ease-out
                      hover:shadow-lg
                      hover:-translate-y-[1px]
                    "
                  >
                    <span>Hire Talents</span>
                  </button>
                </motion.div>
              </ParallaxLayer>

              <ParallaxLayer offset={1} speed={0} className="px-3 py-20 sm:px-20">
                <div className="flex sm:flex-row flex-col items-center h-full gap-16">
                  {/* VIDEO CARD */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-full sm:w-[50%] flex justify-center group"
                  >
                    {/* STACKED BACK CARDS */}
                    <div className="absolute inset-0 flex justify-center items-center -z-10">
                      <div className="absolute w-[100%] h-[100%] bg-gray-300/70 rounded-3xl rotate-[-6deg]" />
                      <div className="absolute w-[100%] h-[100%] bg-gray-400/60 rounded-3xl rotate-[4deg]" />
                    </div>

                    {/* MAIN VIDEO CARD */}
                    <div className="relative w-full max-w-[670px] rounded-3xl overflow-hidden shadow-2xl">
                      {/* VIDEO */}
                      <video
                        ref={videoRef}
                        src="/videos/HJYJ3497.MP4"
                        loop
                        playsInline
                        className="w-full h-[210px] sm:h-[380px] object-cover"
                      />

                      {/* SOFT OVERLAY */}
                      <div className="absolute inset-0 bg-black/20" />

                      {/* CONTROLS */}
                      <button
                        onClick={togglePlay}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                      >
                        <div className="relative flex items-center justify-center">
                          {/* RIPPLE RINGS (ONLY WHEN NOT PLAYING) */}
                          {!isPlaying &&
                            [0, 1, 2, 3, 4].map((i) => (
                              <span
                                key={i}
                                className="absolute rounded-full border border-dashed animate-ping"
                                style={{
                                  width: 50 + i * 5,
                                  height: 50 + i * 5,
                                  borderColor:
                                    i % 2 === 0
                                      ? "bg-main/50"
                                      : "rgba(34,197,94,0.7)", // green accents
                                  animationDelay: `${i * 0.35}s`,
                                }}
                              />
                            ))}
 
                          {/* PLAY / PAUSE ICON */}
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-opacity duration-300 ${
                              !isPlaying 
                                ? 'bg-main/50 group-hover:bg-main/100' 
                                : 'bg-transparent'
                            }`}
                            >
                            {/* PLAY: always visible */}
                            {!isPlaying && (
                              <FaPlay className="text-white ml-1 text-lg" />
                            )}

                            {/* PAUSE: visible only on hover */}
                            {isPlaying && (
                              <FaPause className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}
                          </div>
                        </div>

                        {/* LABEL */}
                        <span className="mt-4 text-white text-sm opacity-0 font-bold tracking-wide group-hover:opacity-100 transition-opacity">
                          {isPlaying ? "Pause Video" : "Watch Video"}
                        </span>
                      </button>
                    </div>
                  </motion.div>

                  {/* TEXT CONTENT */}
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="w-full sm:w-[45%] max-w-2xl max-sm:px-2"
                  >
                    <p className="text-xl uppercase tracking-[0.3em] text-gray-500 mb-4 font-bold">
                      About Us
                    </p>

                    <h2 className="text-3xl sm:text-5xl font-semibold mb-6">
                      The Leading Hospitality <br /> Staffing Platform
                    </h2>

                    <p className="text-gray-600 mb-6">
                      We connect hospitality businesses with exceptional professionals
                      while enabling seamless workforce scaling.
                    </p>

                    <ul className="space-y-4">
                      <li className="flex gap-3 items-center">
                        <span className="text-main text-2xl">
                            <PiCheckCircleFill />
                        </span>
                        This helps businesses maintain service excellence
                      </li>
                      <li className="flex gap-3 items-center">
                        <span className="text-main text-2xl">
                            <PiCheckCircleFill />
                        </span>
                        This scalability allows businesses to adjust staffing
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </ParallaxLayer>

              <ParallaxLayer offset={2} speed={0} className="relative max-sm:py-12">
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
                        <WhyUs
                          key={i}
                          icon={item.iconSvg}
                          title={item.title}
                          details={item.details}
                        />
                      ))}
                  </div>
                </motion.div>
              </ParallaxLayer>

              <ParallaxLayer offset={isMobile ? 3.4 : 3} speed={0} className="max-sm:hidden">
                    <div className="sm:h-[65vh] relative w-full">
                        <Image 
                          src={"/images/reg.jpg"}
                          alt="Researchers"
                          fill
                          className="object-cover"
                        />
                    </div>
              </ParallaxLayer>

              <ParallaxLayer offset={isMobile ? 3.4 : 3} speed={0}>
                <motion.div
                  className="h-fit sm:h-[65vh] sm:bg-black/80 text-2xl sm:text-5xl px-5 py-16 sm:p-20 text-center font-bold text-main sm:text-white">
                    <motion.p 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      Research Employers <br /> Before You Apply
                    </motion.p>
                </motion.div>
              </ParallaxLayer>

              <ParallaxLayer offset={isMobile ? 3.99 : 3.5} speed={0.3} className="flex sm:flex-row flex-col justify-center gap-20 max-sm:px-5">
                <div className="px-6 pt-10 pb-6 flex flex-col gap-5 w-full sm:w-[35%] sm:h-[83%] shadow-xl bg-white rounded-xl -translate-y-14 sm:-translate-y-40 transition-all duration-500 ease-out  hover:shadow-2xl">
                  <p className="text-4xl text-gray-500 w-20 h-20 bg-gray-100 shadow-lg rounded-full flex items-center justify-center mx-auto transition-transform duration-300 ease-out hover:scale-110">
                    <GrUserWorker />
                  </p>
                  <h2 className="text-center font-black text-xl sm:text-4xl">Overseas Talent</h2>
                  <p className="text-center text-sm">
                    Join over 100 workers who <br /> use IMMA HIRED to find flexible and temp to hire
                  </p>
                  <button 
                    onClick={() => window.location.href = "/jobs"}
                    className="
                      flex mx-auto items-center justify-center
                      w-fit
                      btn-sweep
                      relative
                      px-10 py-5
                      rounded-full
                      text-sm font-semibold tracking-wide
                      bg-main text-white
                      transition-all duration-300 ease-out
                      hover:shadow-lg
                      hover:-translate-y-[1px]">
                    Find Jobs
                  </button>
                  <div className="relative w-full h-[200px] sm:h-[80%] rounded-xl overflow-hidden transition-transform duration-500 ease-out hover:scale-105">
                    <Image
                      src={"/images/OJXL4E0.jpg"}
                      alt="Image"
                      fill
                      className="object-cover"
                    />
                  </div>

                </div>

                <div className="px-6 pt-10 pb-6 flex flex-col gap-5 w-full sm:w-[35%] h-[83%] shadow-xl bg-white rounded-xl -translate-y-28 sm:-translate-y-40 transition-all duration-500 ease-out  hover:shadow-2xl">
                  <p className="text-4xl text-gray-500 w-20 h-20 bg-gray-100 shadow-lg rounded-full flex items-center justify-center mx-auto transition-transform duration-300 ease-out hover:scale-110">
                    <BsBuildingsFill />
                  </p>
                  <h2 className="text-center font-black text-xl sm:text-4xl">For Organizations</h2>
                  <p className="text-center text-sm">Finding individuals who share your <br /> company&apos;s values and vision can contribute  to a cohesive</p>
                  <button 
                    onClick={handleHire}
                    className="
                      flex mx-auto items-center justify-center
                      w-fit
                      btn-sweep
                      relative
                      px-10 py-5
                      rounded-full
                      text-sm font-semibold tracking-wide
                      bg-main text-white
                      transition-all duration-300 ease-out
                      hover:shadow-lg
                      hover:-translate-y-[1px]
                  ">Hire Talents</button>
                  <div className="relative w-full h-[200px] sm:h-[80%] rounded-xl overflow-hidden transition-transform duration-500 ease-out hover:scale-105">
                    <Image 
                      src={"/images/3525444.jpg"}
                      alt="Image"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </ParallaxLayer>

              <ParallaxLayer offset={ isMobile ? 4.59 : 4.1} className="max-sm:hidden">
                  <div className="relative grid grid-cols-1 sm:grid-cols-3 max-sm:translate-y-20 sm:gap-8 mt-20 sm:py-16">
                      {[
                        { value: "100+", label: "Daily Active Users" },
                        { value: "5K+", label: "Open Job Positions" },
                        { value: "10K+", label: "Success Stories Shared" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="
                            group
                            text-center
                            flex flex-col items-center
                            gap-2
                          "
                        >
                          <h1
                            className="
                              text-xl md:text-4xl sm:text-5xl font-black
                              tracking-tight
                              bg-clip-text text-transparent
                              bg-gradient-to-br from-main to-black
                              transition-transform duration-300
                              group-hover:-translate-y-1
                            "
                          >
                            {item.value}
                          </h1>
                          <span className="text-sm uppercase tracking-widest text-black/60">
                            {item.label}
                          </span>
                      </div>
                    ))}
                  </div>
              </ParallaxLayer>

              {/* Story */}
              <ParallaxLayer
                sticky={{ start: isMobile ? 5 : 4.5, end: isMobile ? 7 : 6.5 }}
                className="relative opacity-90"
              >
                <Image
                        src={'/images/pexels-jopwell-2422280.jpg'}
                        alt={`background image`}
                        fill
                        className="object-cover"
                      /> 
              </ParallaxLayer>

              <ParallaxLayer
                id="story"
                sticky={{ start: isMobile ? 5 : 4.5, end: isMobile ? 7 : 6.5 }}
                className="flex sm:items-center px-5 py-28 sm:p-40 backdrop-blur-2xl bg-black/60"
              >
                <motion.h2
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 18,
                    delay: 0.5,
                  }}
                  viewport={{ once: true }}
                  className="text-4xl sm:text-9xl text-gray-300 font-extrabold sm:leading-[90px]"
                >
                  <span className="text-5xl">OUR</span>  <br /> STORY
                </motion.h2>
              </ParallaxLayer>

              <ParallaxLayer sticky={{ start: isMobile ? 5.3 : 4.8, end: isMobile ? 5.3 : 4.8 }} speed={0.7} className="z-20 pointer-events-auto">
                <StoryPoint
                  index="01"
                  title="The Beginning"
                  insight="Built from lived experience, not assumptions."
                  text="IMMA HIRED was founded by Imma, a foreign expat in China, who was inspired by the struggles he faced—and saw others facing—in finding opportunities in a new land. After experiencing the frustration of navigating China&apos;s job market as an international talent, Imma wanted to create a platform that would give foreign professionals like Lisa, an MBA student, a place to thrive"
                />
              </ParallaxLayer>

              <ParallaxLayer sticky={{ start: isMobile ? 6.1 : 5.6, end: isMobile ? 6.1 : 5.6 }} speed={0.7} className="z-20 pointer-events-auto">
                <StoryPoint
                  index="02"
                  insight="Where opportunity meets the right talent without friction"
                  title="The Bridge"
                  text="IMMA HIRED is more than just a job portal; it&apos;s a bridge between foreign talent and employers who are searching for skilled candidates. Lisa uploaded her resume, and Mr. Zhang, an employer, discovered her profile—both achieving their goals."
                />
              </ParallaxLayer>

              <ParallaxLayer sticky={{ start: isMobile ? 6.9 : 6.4, end: isMobile ? 6.9 : 6.4 }} speed={0.7} className="z-20 pointer-events-auto">
                <StoryPoint
                  index="03"
                  title="The Belief"
                  insight="Success isn&apos;t luck. It&apos;s access."
                  text="Driven by the belief that everyone deserves a chance to succeed, IMMA HIRED helps talented individuals find meaningful careers and build a future in China, one success story at a time."
                />

                  <div className="relative grid grid-cols-1 sm:grid-cols-3 max-sm:-translate-y-10 gap-8 mt-20 sm:py-16 sm:hidden">
                      {[
                        { value: "100+", label: "Daily Active Users" },
                        { value: "5K+", label: "Open Job Positions" },
                        { value: "10K+", label: "Success Stories Shared" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="
                            group
                            text-center
                            flex flex-col items-center
                            gap-2
                          "
                        >
                          <h1
                            className="
                              text-4xl sm:text-5xl font-black
                              tracking-tight
                              bg-clip-text text-transparent
                              bg-gradient-to-br from-main to-white
                              transition-transform duration-300
                              group-hover:-translate-y-1
                            "
                          >
                            {item.value}
                          </h1>
                          <span className="text-sm uppercase tracking-widest text-white">
                            {item.label}
                          </span>
                      </div>
                    ))}
                  </div>
              </ParallaxLayer>

              {/* Industries + teams */}
              <ParallaxLayer offset={ isMobile ? 8 : 7.5} speed={0}>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
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
                          <h3 className="text-xl font-semibold tracking-tight text-gray-100 group-hover:text-main transition-colors">
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
                  {industries.length > 6 && !isMobile && (
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
                  )}
                </section>

                <section className="sm:py-14" id="team">
                  <h2 className="text-2xl sm:text-5xl pb-10 sm:p-20 text-center  font-bold">Meet The Team</h2>
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay:0.5 }}
                    className="flex sm:flex-row max-sm:justify-center max-sm:gap-8 flex-col justify-evenly">
                      <div className="text-center w-full sm:w-[30%] flex items-center gap-2 flex-col">
                        <div className="relative w-[215px] h-60 sm:w-64 sm:h-72 overflow-hidden rounded-xl bg-white">
                          <Image
                            src={'/images/img-2.png'}
                            fill
                            alt="Profile image"
                            className="object-bottom"
                          />
                        </div>
                        <p className="text-xl font-bold ">Imma Jing</p>
                        <p>CEO</p>
                      </div>

                      <div className="text-center w-full sm:w-[30%] flex items-center gap-2 flex-col">
                        <div className="relative w-[215px] h-60 sm:w-64 sm:h-72 overflow-hidden rounded-xl bg-white">
                          <Image
                            src={'/images/img3.png'}
                            fill
                            alt="Profile image"
                            className="object-bottom"
                          />
                        </div>
                        <p className="text-xl font-bold ">Maggie luo</p>
                        <p>Recruitment Specialist</p>
                      </div>

                      <div className="text-center w-full sm:w-[30%] flex items-center gap-2 flex-col">
                        <div className="relative w-[215px] h-60 sm:w-64 sm:h-72 overflow-hidden rounded-xl bg-white">
                          <Image
                            src={'/images/img1.png'}
                            fill
                            alt="Profile image"
                            className="object-bottom"
                          />
                        </div>
                        <p className="text-xl font-bold ">Chen Lanping</p>
                        <p>Sales and Marketing Specialist</p>
                      </div>
                  </motion.div>
                </section>

                <section className="py-20">
                    <Testimonial target={target} />
                </section>
              </ParallaxLayer>

              <ParallaxLayer offset={isMobile ? 15 : 10.7} speed={0} className="flex items-end">
                    <Footer />
              </ParallaxLayer>
            </Parallax>
            
        </section>
  );
}

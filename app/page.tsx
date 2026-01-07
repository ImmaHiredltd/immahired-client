"use client";

import Image from "next/image";
import pageLanguage from "@/app/page.json";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { useMediaQuery } from "react-responsive";

import Navbar from "@/components/nav";
import Footer from "@/components/footer";
import Video from "@/components/video";
import WhyUs from "@/components/whyUs";
import Industries from "@/components/industries";
import Team from "@/components/team";
import HowItWorks from "@/components/howItWorks";
import Testimonial from "@/components/testimonials";
import StoryPoint from "@/components/storyPoint";

import { LanguageData } from "./context";
import { UserData } from "./tokenContext";
import { useGetJobsQuery } from "./api/general";

import { FaRegDotCircle } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { GrUserWorker } from "react-icons/gr";
import { BsBuildingsFill } from "react-icons/bs";
import { ToastContainer } from "react-toastify";

export default function Home() {
  useGetJobsQuery(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [active] = useContext(UserData);
  const languageContext = useContext(LanguageData);
  const isMobile = useMediaQuery({ maxWidth: 640 });

  if (!languageContext) {
    throw new Error("LanguageData context missing");
  }

  const [language] = languageContext;
  const jsonData: any = pageLanguage;
  const target = jsonData[language];

  const token = Cookies.get("token");
  const tokenData = token ? JSON.parse(token) : null;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const industriesMarquee = [
    target.industry_1,
    target.industry_2,
    target.industry_3,
    target.industry_4,
    target.industry_5,
    target.industry_6,
    target.industry_7,
    target.industry_8,
    target.industry_9,
  ];

  const handleHire = () => {
    if (active && ["employer", "admin"].includes(tokenData?.data?.type)) {
      window.location.href = "/candidates";
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <main 
      className="w-full overflow-x-hidden bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/abstract_background_with_a_low_poly_design_0107.jpg')" }}
    >
      <Navbar isScrolled={isScrolled} />
      <ToastContainer />

      {/* ================= HERO ================= */}
      <section
        className="relative min-h-screen flex flex-col items-center overflow-hidden justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/abstract_background_with_a_low_poly_design_0107.jpg')",
        }}
      >

        <div className="absolute w-screen h-screen top-0 z-10 overflow-hidden"> 
          {/* floating shapes */}
          <div className="absolute top-0 left-52 w-full h-full pointer-events-none overflow-hidden">
              <div className="floating-shape shape-1 bg-main/20 rounded-full w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72"></div>
              <div className="floating-shape shape-2 bg-abstract/20 rounded-full w-32 h-32 sm:w-48 sm:h-48 lg:w-60 lg:h-60"></div>
              <div className="floating-shape shape-3 bg-black/10 rounded-full w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48"></div>
            </div>

            {/* bacground floating shapes */}
            <div className="absolute bottom-0 right-0 animate-pulse w-fit h-full pointer-events-none overflow-hidden">
              <div className="shape-1 bg-main/20 rounded-full w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72"></div>
              <div className="shape-2 bg-abstract/20 rounded-full w-32 h-32 sm:w-48 sm:h-48 lg:w-60 lg:h-60"></div>
              <div className="shape-3 bg-black/10 rounded-full w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48"></div>
            </div>

            {/* hovering shapes */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden">
              <div className="shape-1 bg-main/10 rounded-full w-72 h-72 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px]"></div>
              <div className="shape-2 bg-abstract/10 rounded-full w-60 h-60 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px]"></div>
              <div className="shape-3 bg-black/5 rounded-full w-48 h-48 sm:w-64 sm:h-64 lg:w-[300px] lg:h-[300px]"></div>
            </div>
        </div>

        <div className="absolute w-screen h-screen backdrop-blur-2xl z-20 flex items-center justify-center flex-col">
            <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90 }}
            className="font-black text-6xl sm:max-w-[70%] max-sm:text-3xl"
          >
            {target.h1}
          </motion.h1>

          <div className="text-6xl max-sm:text-3xl text-black font-black">
            <Typewriter
              options={{
                strings: [target.h1_add, target.h1_add2],
                autoStart: true,
                loop: true,
                cursor: "",
              }}
            />
          </div>

          <p className="mt-6 max-w-3xl text-xl max-sm:text-sm font-semibold px-6">
            {target.p_banner}
          </p>

          <div className="mt-10 flex gap-4 max-sm:flex-col">
            <button
              onClick={() => (window.location.href = "/jobs")}
              className="btn-sweep bg-white px-10 py-5 rounded-full font-semibold flex items-center gap-2"
            >
              {target.find_jobs}
              <FaArrowTrendUp />
            </button>

            <button
              onClick={handleHire}
              className="btn-sweep bg-main text-white px-12 py-5 rounded-full font-semibold"
            >
              {target.hire_talents}
            </button>
          </div>

          <section className="bg-abstract py-8 sm:rotate-[-2deg] absolute bottom-0 sm:bottom-10 w-full z-40">
            <div className="marquee-track text-white flex gap-20 whitespace-nowrap">
              {industriesMarquee.map((i, idx) => (
                <span key={idx} className="flex gap-6 items-center">
                  {i}
                  <FaRegDotCircle />
                </span>
              ))}
            </div>
          </section>
        </div>
        

        
      </section>

      {/* ================= VIDEO ================= */}
      <section className="pt-24 sm:py-24 px-5 sm:px-20 bg-white">
        <Video target={target} />
      </section>

      {/* ================= WHY US ================= */}
      <section className=" relative min-h-screen max-sm:h-fit flex justify-center items-centeroverflow-hidden">
        <div className="absolute w-[800px] sm:w-[800px] h-[800px] sm:h-[800px] rounded-full right-20 bottom-20 sm:-bottom-52 bg-main/20" />
        <div className="w-full sm:py-24 min-h-screen backdrop-blur-3xl">
          <WhyUs target={target} />   
        </div>
      </section>

      {/* ================= RESEARCH ================= */}
      <section className="relative h-[22vh] sm:min-h-[65vh]">
          <Image
            src="/images/reg.jpg"
            alt="research"
            fill
            className="object-cover"
          />
        <div className="relative bg-black/80 h-[22vh] sm:min-h-[65vh] flex items-center justify-center text-center text-main sm:text-white px-10">
          <p className="text-2xl sm:text-5xl font-bold max-w-4xl max-sm:mb-5">
            {target.research}
          </p>
        </div>
      </section>

      {/* ================= CARDS ================= */}
      <section className="flex sm:flex-row flex-col justify-center gap-20 max-sm:px-5">
          <div className="px-6 pt-10 pb-6 flex flex-col gap-5 w-full sm:w-[35%] sm:h-[83%] shadow-xl bg-white rounded-xl -translate-y-14 sm:-translate-y-40 transition-all duration-500 ease-out  hover:shadow-2xl">
            <p className="text-4xl text-gray-500 w-20 h-20 bg-gray-100 shadow-lg rounded-full flex items-center justify-center mx-auto transition-transform duration-300 ease-out hover:scale-110">
              <GrUserWorker />
            </p>
            <h2 className="text-center font-black text-xl sm:text-4xl">{target.overseas_talent}</h2>
            <p className="text-center text-sm sm:w-[90%] mx-auto">
              {target.overseas_talent_p}
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
              {target.find_jobs}
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

          <div className="px-6 pt-10 pb-6 flex flex-col gap-5 w-full sm:w-[35%] h-[83%] shadow-xl bg-white rounded-xl -translate-y-20 sm:-translate-y-40 transition-all duration-500 ease-out  hover:shadow-2xl">
            <p className="text-4xl text-gray-500 w-20 h-20 bg-gray-100 shadow-lg rounded-full flex items-center justify-center mx-auto transition-transform duration-300 ease-out hover:scale-110">
              <BsBuildingsFill />
            </p>
            <h2 className="text-center font-black text-xl sm:text-4xl">{target.for_organizations}</h2>
            <p className="text-center text-sm sm:w-[90%] mx-auto">{target.for_organizations_p}</p>
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
                  ">{target.hire_talents}</button>
            <div className="relative w-full h-[200px] sm:h-[80%] rounded-xl overflow-hidden transition-transform duration-500 ease-out hover:scale-105">
              <Image
                src={"/images/3525444.jpg"}
                alt="Image"
                fill
                className="object-cover"
              />
            </div>
          </div>

      </section>

      <section className="sm:mb-20 mb-10">
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 sm:py-16">
            {[
              { value: "100+", label: target.metrics_1 },
              { value: "5K+", label: target.metrics_2 },
              { value: "10K+", label: target.metrics_3 },
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
                              sm:text-8xl text-4xl font-black
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
      </section>

      {/* ================= STICKY STORY ================= */}
      <section id="story" className="w-screen h-[170vh] sm:h-screen relative">
        <div className="absolute top-0 h-full w-screen">
          <Image
            src="/images/pexels-jopwell-2422280.jpg"
            alt="story bg"
            fill
            className="object-cover"
          />
        </div>

        <div className="absolute z-40 w-screen max-sm:flex max-sm:flex-col max-sm:justify-center max-sm:items-center space-y-16 py-10 px-5 sm:p-20 h-full bg-black/60  backdrop-blur-xl">
            <h2 className="text-4xl sm:text-6xl text-center font-extrabold text-gray-300 w-full">
              {target.our_story}
            </h2>
          <div className="flex sm:flex-row gap-10 flex-col justify-evenly ">
            <StoryPoint
              index="01"
              title={target.story_1}
              insight={target.story_1_insight}
              text={target.story_1_p}
            />
            <StoryPoint
              index="02"
              title={target.story_2}
              insight={target.story_2_insight}
              text={target.story_2_p}
            />
            <StoryPoint
              index="03"
              title={target.story_3}
              insight={target.story_3_insight}
              text={target.story_3_p}
            />
          </div>
        </div>
      </section>

      

      {/* ================= INDUSTRIES ================= */}
      <Industries target={target} />
      <Team target={target} />
      <HowItWorks target={target} />

      <section className="py-20">
        <Testimonial target={target} />
      </section>

      <Footer />
    </main>
  );
}

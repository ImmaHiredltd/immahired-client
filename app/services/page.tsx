"use client";

import React, { useContext, useState } from "react";
import { LanguageData } from "../context";
import servicesLanguage from "@/app/services/service.json";
import Navbar from "@/components/nav";
import Footer from "@/components/footer";
import Header from "@/components/headers";
import Image from "next/image";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";

import img1 from "@/public/images/Frame 269.png";
import img2 from "@/public/images/reg.jpg";
import img3 from "@/public/images/pexels-divinetechygirl-1181406.jpg";
import img4 from "@/public/images/pexels-august-de-richelieu-4427815.jpg";
import img5 from "@/public/images/pexels-jopwell-2422280.jpg";
import img6 from "@/public/images/pexels-cowomen-1058097-2041627.jpg";

const jsonData: any = servicesLanguage;

export default function Services() {
  const languageContext = useContext(LanguageData);
  if (!languageContext) throw new Error("LanguageData not provided");

  const [language] = languageContext;
  const target = jsonData[language];

  const [index, setIndex] = useState(0);
  const [index2, setIndex2] = useState(0);

  const primary = [
    { title: target.h1_one, details: target.h1_one_details, img: img1 },
    { title: target.h1_two, details: target.h1_two_details, img: img2 },
    { title: target.h1_three, details: target.h1_three_details, img: img3 },
    { title: target.h1_four, details: target.h1_four_details, img: img4 },
    { title: target.h1_five, details: target.h1_five_details, img: img5 },
    { title: target.h1_six, details: target.h1_six_details, img: img6 },
  ];

  const secondary = [
    { title: target.h2_one_d, details: target.h2_one_details, img: img6 },
    { title: target.h2_two_d, details: target.h2_two_details, img: img5 },
    { title: target.h2_three_d, details: target.h2_three_details, img: img3 },
    { title: target.h2_four_d, details: target.h2_four_details, img: img4 },
  ];

  const Section = ({
    title,
    data,
    index,
    setIndex,
  }: any) => (
    <section className="h-screen [@media(min-width:2000px)]:h-[1000px] [@media(min-width:2000px)]:max-w-[2300px] mx-auto flex flex-col justify-center gap-12">
      <h2 className="text-2xl font-black text-center">{title}</h2>

      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={data[index].img}
            fill
            alt="Service background"
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[420px] p-10 lg:p-16">
          <div className="flex flex-col justify-center gap-6 text-white max-w-xl">
            <h2 className="text-3xl lg:text-4xl font-bold">
              {data[index].title}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {data[index].details}
            </p>

            {/* Controls */}
            <div className="flex items-center gap-4 pt-6">
              <button
                onClick={() => setIndex(index - 1)}
                disabled={index === 0}
                className="p-3 rounded-full bg-white/10 hover:bg-main transition disabled:opacity-30"
              >
                <RxCaretLeft className="text-3xl" />
              </button>

              <span className="text-sm tracking-widest">
                {index + 1} / {data.length}
              </span>

              <button
                onClick={() => setIndex(index + 1)}
                disabled={index === data.length - 1}
                className="p-3 rounded-full bg-white/10 hover:bg-main transition disabled:opacity-30"
              >
                <RxCaretRight className="text-3xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <section 
      style={{backgroundImage: "url('/images/abstract_background_with_a_low_poly_design_0107.jpg')" }}
      className="bg-cover bg-center bg-no-repeat relative">
      <Navbar isScrolled />

      <main className="px-job-clamp py-20">
        <Section
          title={target.h1_service}
          data={primary}
          index={index}
          setIndex={setIndex}
        />

        <Section
          title={target.h2_service}
          data={secondary}
          index={index2}
          setIndex={setIndex2}
        />
      </main>

      <Footer />
    </section>
  );
}

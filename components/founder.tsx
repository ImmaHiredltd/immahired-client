"use client";

import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SideImage from "./sideImage";
import about_2 from "@/public/images/Frame 55.png";
import Header from "./headers";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { LanguageData } from "@/app/context";
import aboutLanguage from "@/app/about/about.json";
import Image from "next/image";

const jsonData: any = aboutLanguage;

export default function Founder({ isMobileWidth, isMobileHeight }: { isMobileWidth: boolean; isMobileHeight: boolean }) {
  const languageContext = useContext(LanguageData);

  if (!languageContext) {
    throw new Error("LanguageData context is not provided!");
  }

  const [language] = languageContext;
  const target: any = jsonData[language];

  const details = [
    target.details_f_1,
    target.details_f_2,
    target.details_f_3,
  ];

  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  const next = () => setIndex((i) => Math.min(i + 1, details.length - 1));

  return (
    <section
      id="founder"
      className="relative h-fit flex lg:flex-row flex-col items-center justify-between px-banner-clamp py-28 max-[380px]:py-24 sm:py-20 gap-14"
    >
      {/* IMAGE */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="relative mx-auto w-[260px] h-[260px] max-[380px]:h-[240px] max-[380px]:w-[240px] sm:w-[320px] sm:h-[320px]"
      >
        {/* Glow Ring */}
        <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-main/30 blur-2xl"
        />

        {/* Image Container */}
        <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-[90%] max-[380px]:w-[80%] bg-gray-300 mx-auto flex h-full rounded-xl overflow-hidden z-10"
        >
            <Image
              src="/images/img-2.png"
              fill
              priority
              alt="Founder"
              className="object-bottom grayscale-[10%] hover:grayscale-0 transition-all duration-700"
            />
        </motion.div>

        </motion.div>


      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="w-full lg:w-[50%] space-y-6"
      >
        <Header title={target.founder} />

        {/* SLIDING TEXT */}
        <div className="relative sm:min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`text-gray-700 max-[380px]:text-sm ${isMobileHeight && isMobileWidth && "text-sm"} leading-relaxed`}
            >
              {details[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-6 sm:pt-4">
          <button
            onClick={prev}
            disabled={index === 0}
            className={`
              p-2 rounded-full max-[380px]:text-2xl text-4xl text-white
              transition-all duration-300
              ${
                index === 0
                  ? "bg-main/40 cursor-not-allowed"
                  : "bg-main hover:scale-110 hover:shadow-lg"
              }
            `}
          >
            <RxCaretLeft />
          </button>

          {/* PROGRESS */}
          <div className="flex gap-2">
            {details.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === index ? "bg-main scale-125" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={index === details.length - 1}
            className={`
              p-2 rounded-full text-4xl max-[380px]:text-2xl text-white
              transition-all duration-300
              ${
                index === details.length - 1
                  ? "bg-main/40 cursor-not-allowed"
                  : "bg-main hover:scale-110 hover:shadow-lg"
              }
            `}
          >
            <RxCaretRight />
          </button>
        </div>
      </motion.div>
    </section>
  );
}

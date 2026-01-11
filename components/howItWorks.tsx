import React, { useState } from 'react'
import { AnimatePresence, motion } from "framer-motion"
import { FaToolbox, FaUsers } from 'react-icons/fa6';

type ModeType = "talent" | "business";


export default function HowItWorks({target}: any) {
    const Toggle = ({
      mode,
      setMode,
    }: {
      mode: ModeType;
      setMode: (m: ModeType) => void;
    }) => {
      return (
        <div className="relative h-fit inline-flex max-[380px]:mx-5 max-[380px]:w-[90%] justify-center max-sm:text-sm items-center bg-main/30 p-2 rounded-full max-[380px]:mb-8 mb-20">
          {/* Sliding indicator */}
          <motion.div
            className="absolute top-2 left-2 h-[52px] w-[160px] sm:w-[200px] max-[380px]:hidden rounded-full bg-main"
            animate={{
              x: mode === "talent" ? 0 : 200,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <button
            onClick={() => setMode("talent")}
            className={`relative z-10 flex items-center h-[52px] gap-3 px-4 max-[380px]:text-sm sm:px-8 py-3 w-[180px] sm:w-[200px] justify-center font-semibold ${
              mode === "talent" ? "text-white max-[380px]:text-black" : "text-white"
            }`}
          >
            <FaUsers /> {target.for_talent}
          </button>

          <button
            onClick={() => setMode("business")}
            className={`relative z-10 flex items-center h-[52px] max-[380px]:text-sm gap-3 px-4 sm:px-8 py-3 w-[180px] sm:w-[200px] justify-center font-semibold ${
              mode === "business" ? "text-white max-[380px]:text-black" : "text-white"
            }`}
          >
            <FaToolbox /> {target.for_business}
          </button>
        </div>

      );
};

const STEPS = {
  talent: [
    {
      step: "1",
      title: target.how_it_works_step_1_title ,
      description:
        target.how_it_works_step_1_description,
    },
    {
      step: "2",
      title: target.how_it_works_step_2_title,
      description:
        target.how_it_works_step_2_description,
    },
    {
      step: "3",
      title: target.how_it_works_step_3_title,
      description:
        target.how_it_works_step_3_description,
    },
  ],
  business: [
    {
      step: "1",
      title: target.set_up_your_account,
      description:
        target.set_up_your_account_description,
    },
    {
      step: "2",
      title: target.post_job_openings,
      description:
       target.post_job_openings_description,
    },
    {
      step: "3",
      title: target.manage_applications,
      description:
        target.manage_applications_description,
    },
  ],
};


const Steps = ({ mode }: { mode: ModeType }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 max-sm:mx-5 md:grid-cols-3 gap-10 text-left"
      >
        {STEPS[mode].map((item) => (
          <StepCard key={item.step} {...item} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

const StepCard = ({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-blue-900 rounded-2xl p-5 sm:p-10 text-white shadow-xl btn-sweep">
      <div className="flex items-center gap-4 mb-6">
        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-main text-white font-bold">
          {step}
        </span>
        <h3 className="text-xl max-[380px]:text-lg sm:text-2xl font-extrabold">{title}</h3>
      </div>

      <p className="text-white/90 max-[380px]:text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};
    const [mode, setMode] = useState<ModeType>("talent");
  return (
    <section className="relative w-full max-[380px]:py-14 py-24 sm:py-32 mt-20 bg-abstract overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/images/topography.svg')] opacity-20" />

                  <div className="relative z-10 max-w-7xl mx-auto sm:px-6 text-center">
                    <h2 className="text-white max-[380px]:text-xl text-3xl sm:text-5xl font-extrabold max-[380px]:mb-8 mb-14">
                      {target.how_it_works}
                    </h2>

                    <Toggle mode={mode} setMode={setMode} />

                    <Steps mode={mode} />
                  </div>
                </section>
  )
}

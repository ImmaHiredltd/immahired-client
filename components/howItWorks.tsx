import React, { useState } from 'react'
import { AnimatePresence, motion } from "framer-motion"
import { FaToolbox, FaUsers } from 'react-icons/fa6';

type ModeType = "talent" | "business";

  const Toggle = ({
  mode,
  setMode,
}: {
  mode: ModeType;
  setMode: (m: ModeType) => void;
}) => {
  return (
    <div className="relative h-fit inline-flex justify-center max-sm:text-sm items-center bg-main/30 p-2 rounded-full mb-20">
      {/* Sliding indicator */}
      <motion.div
        className="absolute top-2 left-2 h-[52px] w-[160px] sm:w-[200px] rounded-full bg-main"
        animate={{
          x: mode === "talent" ? 0 : 200,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      <button
        onClick={() => setMode("talent")}
        className={`relative z-10 flex items-center h-[52px] gap-3 px-4 sm:px-8 py-3 w-[180px] sm:w-[200px] justify-center font-semibold ${
          mode === "talent" ? "text-white" : "text-white"
        }`}
      >
        <FaUsers /> For Talents
      </button>

      <button
        onClick={() => setMode("business")}
        className={`relative z-10 flex items-center h-[52px] gap-3 px-4 sm:px-8 py-3 w-[180px] sm:w-[200px] justify-center font-semibold ${
          mode === "business" ? "text-white" : "text-white"
        }`}
      >
        <FaToolbox /> For Business
      </button>
    </div>

  );
};

const STEPS = {
  talent: [
    {
      step: "1",
      title: "Create Your Profile",
      description:
        "Sign up in minutes and build a professional profile that highlights your skills and experience.",
    },
    {
      step: "2",
      title: "Find Flexible Jobs",
      description:
        "Browse available roles that match your availability and career goals.",
    },
    {
      step: "3",
      title: "Get Paid Easily",
      description:
        "Work confidently, get reviewed, and receive secure payments on time.",
    },
  ],
  business: [
    {
      step: "1",
      title: "Sign up, It's Free!",
      description:
        "Our team will set up your account and help you build an easy-to-use dashboard.",
    },
    {
      step: "2",
      title: "Post jobs in minutes",
      description:
        "Create and post anywhere from 1–100 job openings with just a few clicks.",
    },
    {
      step: "3",
      title: "Review Your Staff",
      description:
        "View bios, reviews, rosters, and pay workers effortlessly.",
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
        <h3 className="text-xl sm:text-2xl font-extrabold">{title}</h3>
      </div>

      <p className="text-white/90 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};




export default function HowItWorks() {
    const [mode, setMode] = useState<ModeType>("talent");
  return (
    <section className="relative w-full py-20 sm:py-32 mt-20 bg-abstract overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/images/topography.svg')] opacity-20" />

                  <div className="relative z-10 max-w-7xl mx-auto sm:px-6 text-center">
                    <h2 className="text-white text-3xl sm:text-5xl font-extrabold mb-14">
                      How It Works?
                    </h2>

                    <Toggle mode={mode} setMode={setMode} />

                    <Steps mode={mode} />
                  </div>
                </section>
  )
}

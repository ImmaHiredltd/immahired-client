import React from 'react'
import { motion } from "framer-motion"


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
      sm:w-[32%] w-full
      h-fit sm:h-[450px]
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
        px-5 sm:px-8 py-12 max-[380px]:py-5
        flex flex-col justify-center gap-3 max-[380px]:gap-2
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
      
      <h3 className="text-2xl max-[380px]:text-xl font-bold mt-4">{title}</h3>
      <p className=" text-black/80 max-[380px]:text-xs text-sm mt-4 leading-relaxed">
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

export default StoryPoint;
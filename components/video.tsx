import React, { useRef, useState } from 'react'
import { motion } from "framer-motion"
import { FaPause, FaPlay } from 'react-icons/fa'
import { PiCheckCircleFill } from 'react-icons/pi'


export default function Video() {
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
  return (
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
                      <div className="absolute w-[100%] h-[100%] bg-gray-200/70 rounded-3xl rotate-[-6deg]" />
                      <div className="absolute w-[100%] h-[100%] bg-gray-100/60 rounded-3xl rotate-[4deg]" />
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
                                ? 'bg-black/50 group-hover:bg-main/100' 
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
  )
}

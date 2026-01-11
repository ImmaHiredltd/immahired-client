import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'

export default function Team({target}: any) {
  return (
    <section className="sm:py-12" id="team">
                  <h2 className="text-center pt-28 sm:pt-20 p-10 sm:mb-20">
                    <span className="block text-[12px] max-[380px]:text-[10px] sm:text-sm uppercase tracking-[0.4em] text-abstract/60 mb-3">
                      {target.meet_the_people}
                    </span>

                    <span className="block max-[380px]:text-xl text-4xl sm:text-5xl tracking-[0.2em] font-black text-abstract">
                      {target.meet_the_team}
                    </span>
                  </h2>



                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-3 max-[380px]:gap-2 gap-5 sm:gap-10 px-6 sm:px-0"
                  >
                    {/* CARD */}
                    {[
                      {
                        name: "Imma Jing",
                        role: target.ceo,
                        image: "/images/img-2.png",
                      },
                      {
                        name: "Maggie Luo",
                        role: target.recruitment_specialist,
                        image: "/images/img3.png",
                      },
                      {
                        name: "Chen Lanping",
                        role: target.sales_marketing_specialist,
                        image: "/images/img1.png",
                      },
                    ].map((member, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -6 }}
                        transition={{ type: "spring", stiffness: 200, damping: 18 }}
                        className="
                          rounded-2xl
                          transition-shadow
                          text-center
                          p-6
                          flex
                          flex-col
                          items-center
                        "
                      >
                        {/* Image */}
                        <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full overflow-hidden border border-black/10 shadow-lg">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="
                              object-cover
                              object-top
                              transition-transform
                              duration-500
                              group-hover:scale-105
                            "
                          />
                        </div>

                        {/* Text */}
                        <h3 className="mt-6  text-xl font-extrabold tracking-tight">
                          {member.name}
                        </h3>

                        <p className="mt-1 text-sm max-[380px]:text-xs uppercase tracking-widest text-black/60">
                          {member.role}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>

                </section>
  )
}

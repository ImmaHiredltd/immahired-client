import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function ContactSection({ target, setShowChat }: {target: any, setShowChat: any }) {
  return (
    <>
      {/* TOP CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="contact"
        className="h-fit sm:h-[50vh] [@media(min-width:2000px)]:max-w-[2300px] mx-auto [@media(min-width:2000px)]:h-[400px] w-full sm:bg-main px-job-clamp text-main sm:text-white py-10 text-center space-y-4"
      >
        <motion.h2
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-2xl max-[380px]:text-xl sm:text-6xl font-semibold"
        >
          {target.contact}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-xl font-semibold"
        >
          {target.contact_info}
        </motion.p>

        {/* Social Icons */}
        <motion.div
          className="flex justify-center gap-5 text-3xl sm:text-white/70"
          initial="hidden"
          whileInView="show"
          variants={container}
        >
          {[ 
            { icon: <FaFacebookSquare />, href: "https://www.facebook.com/imma.hire" },
            { icon: <FaInstagram />, href: "https://www.instagram.com/immahired/" },
          ].map((item, i) => (
            <motion.div
              key={i}
            //   variants={item}
              whileHover={{ scale: 1.2 }}
              className="transition-all"
            >
              <Link href={item.href}>{item.icon}</Link>
            </motion.div>
          ))}

          <motion.button
            variants={item}
            whileHover={{ scale: 1.2 }}
            onClick={() => setShowChat(true)}
          >
            <IoLogoWechat />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* CONTACT CARDS */}
      <div className="max-sm:px-5 max-sm:mb-10">
        <motion.div
          className="sm:-translate-y-24 flex gap-6 sm:flex-row flex-col justify-evenly"
          variants={container}
          initial="hidden"
          whileInView="show"
        >
          {/* CARD */}
          {[
            {
              country: "China",
              office: "025 5277 0229",
              flag: "https://flagdownload.com/wp-content/uploads/Flag_of_Peoples_Republic_of_China.svg",
              phone: "+86 173 6871 3072",
              email: "contact@immahired.cn",
              address: "Jiangning District , Nanjing City, China",
            },
            // {
            //   country: "Armenia",
            //   flag: "https://flagdownload.com/wp-content/uploads/Flag_of_Armenia.svg",
            //   email: "armenia@immahired.global",
            //   address:
            //     "Yerevan, 25 Mashtots Avenue, 42A building, zip code: 0001",
            // },
            // {
            //   country: "United Kingdom",
            //   flag: "https://flagdownload.com/wp-content/uploads/Flag_of_United_Kingdom.svg",
            //   phone: "+44 121 318 4548",
            //   email: "uk@immahired.global",
            //   address:
            //     "Suite A, 82 James Carter Road, Mildenhall, IP28 7DE",
            // },
          ].map((card, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              }}
              className="w-full sm:w-[30%] [@media(min-width:2000px)]:max-w-[500px] rounded-xl max-sm:text-xs p-6 bg-white shadow-lg space-y-4 transition-all"
            >
              {/* Flag */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative w-[100px] h-[100px]"
              >
                <Image
                  fill
                  alt={`${card.country} flag`}
                  src={card.flag}
                  className="object-contain rounded-sm"
                />
              </motion.div>

              <div className="font-bold text-main text-lg">
                {card.country}
              </div>

              <div className="space-y-3 max-[380px]:text-xs text-sm text-gray-700">
                {card.office && (
                  <p>
                    <span className="font-semibold">Office:</span>{" "}
                    <a href={`tel:${card.office}`}>{card.office}</a>
                  </p>
                )}
                {card.phone && (
                  <p>
                    <span className="font-semibold">Phone/WeChat/WhatsApp:</span>{" "}
                    <a href={`tel:${card.phone}`}>{card.phone}</a>
                  </p>
                )}
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  <a href={`mailto:${card.email}`}>{card.email}</a>
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {card.address}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}

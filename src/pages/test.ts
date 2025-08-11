import { motion } from "framer-motion"
import { MoveRight } from "lucide-react"
import BitcoinAnimation from "./BitcoinAnimation"
import Image from "next/image"
import Link from "next/link"

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background"></div>

      {/* Animated circles container */}
      <div className="w-full h-full flex justify-center items-center">
        {/* Outer Circle */}
        <motion.div
          className="max-w-full lg:max-w-[900px] relative md:max-w-[600px] max-w-[90vw] lg:max-h-[900px] md:max-h-[600px] max-h-[90vh] bg-transparent border-2 border-dashed border-orange-100/60 rounded-full flex justify-center items-center outline-dashed outline-2 outline-orange-100/50 lg:outline-offset-[120px] md:outline-offset-[80px] outline-offset-[45px]"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "linear",
            duration: 60,
          }}
        >


              <div className="absolute bottom-4 left-8 w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 via-primary to-orange-400 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
             <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>

          {/* Middle Circle */}
          <motion.div
            className="lg:w-[650px] relative md:w-[450px] w-[270px] lg:h-[650px] md:h-[450px] h-[270px] bg-orange-100/20 dark:bg-transparent md:border-4 border-2 border-dashed dark:border-2 border-orange-100/80 dark:border-orange-500/20 rounded-full flex justify-center items-center outline-none md:outline-0 outline-dashed outline-2 outline-orange-400/10 outline-offset-[130px]"
            animate={{ rotate: -360 }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              repeatDelay: 1,
              ease: "linear",
              duration: 30,
            }}
          >
             <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
            {/* Inner Circle */}
            <div className="lg:w-[450px] md:w-[300px] w-[190px] lg:h-[450px] md:h-[300px] h-[190px] bg-orange-100/30 border-4 dark:bg-bridgeOrange/10 dark:border-2 dark:border-orange-500/20 border-orange-100 rounded-full flex justify-center items-center"></div>
          </motion.div>
        </motion.div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <motion.div
          className="max-w-4xl mx-auto px-6 md:px-8 text-center flex flex-col justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main Heading */}
          <motion.h1
            className="font-heading font-semibold leading-tight text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                      bg-gradient-to-r from-foreground via-foreground to-bitcoin-orange
                      bg-clip-text text-transparent mb-6 lg:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Hire Creators and Influencers
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="font-sans text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 lg:mb-12
                      max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
             <span className="relative">To Promote Your Brand</span>
          </motion.p>
        </motion.div>

        {/* Call to Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
                        <Button size="lg" className="bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/90 hover:to-[#88B04B]/90 text-white px-8 py-4 rounded-full text-lg font-semibold" onClick={() => navigate("/register?role=influencer")}>
                          Join as Creator
                        </Button>
                        <Button size="lg" variant="outline"  onClick={() => navigate("/register?role=brand")}>
                          Find Influencers
                        </Button>
        </motion.div>
      </div>

      {/* Decorative gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-bitcoin-orange/10 rounded-full blur-3xl opacity-50 animate-pulse-glow"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bitcoin-orange/5 rounded-full blur-3xl opacity-30 animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      ></div>
    </section>
  )
}

export default Hero
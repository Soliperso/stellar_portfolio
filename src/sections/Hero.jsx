import { motion } from 'framer-motion'
import { ChevronDown, Download } from 'lucide-react'
import Scene3D from '../components/Scene3D'

const Hero = () => {
  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Scene3D />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-white/75 dark:from-gray-900/80 dark:via-gray-900/60 dark:to-gray-900/40 z-10" />
      
      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg sm:text-xl text-primary-700 dark:text-primary-400 font-medium"
          >
            Hello, I'm
          </motion.p>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-heading font-bold text-gray-900 dark:text-white"
          >
            Ahmed Chebli
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="space-y-2"
          >
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-heading font-semibold text-gray-900 dark:text-gray-200">
              Full-Stack Developer
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
              Passionate about creating innovative digital solutions that bridge the gap between 
              design and functionality. Specialized in React, Node.js, and modern web technologies.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const projectsSection = document.querySelector('#projects')
                if (projectsSection) {
                  projectsSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl energy-pulse"
            >
              View My Work
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-8 py-4 border-2 border-primary-700 text-primary-700 dark:text-primary-400 hover:bg-primary-700 hover:text-white dark:hover:text-white rounded-lg text-lg font-medium transition-all duration-200"
            >
              <Download size={20} />
              <span>Download CV</span>
            </motion.button>
          </motion.div>

          {/* Skills Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="pt-8"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Specialized in</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'MongoDB'].map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 shadow-sm"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center space-y-2 text-gray-700 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-400 transition-colors duration-200"
        >
          <span className="text-sm font-medium">Scroll Down</span>
          <ChevronDown size={24} />
        </motion.div>
      </motion.button>
    </section>
  )
}

export default Hero
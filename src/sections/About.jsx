import { motion } from 'framer-motion'
import { Code2, Palette, Zap, Users } from 'lucide-react'
import profilePicture from '../assets/pic.jpeg'

const About = () => {
  const features = [
    {
      icon: Code2,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable, and efficient code that follows best practices.'
    },
    {
      icon: Palette,
      title: 'UI/UX Focus',
      description: 'Creating beautiful, intuitive interfaces that provide exceptional user experiences.'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Optimizing applications for speed, efficiency, and excellent user performance.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Working effectively in teams and communicating technical concepts clearly.'
    }
  ]

  const technologies = {
    'Frontend': ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
    'Backend': ['Node.js', 'Express', 'Python', 'FastAPI', 'GraphQL'],
    'Database': ['MongoDB', 'PostgreSQL', 'Redis', 'Supabase'],
    'Tools': ['Git', 'Docker', 'AWS', 'Vercel', 'Figma']
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="space-y-16"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-gray-900 dark:text-white">
              About Me
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
              AI-savvy Flutter developer and problem solver who loves learning new technologies and staying on top of daily tech evolution
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Bio */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                  My Journey
                </h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-400 leading-relaxed">
                  <p>
                    Hello! I'm Ahmed, an AI-savvy Flutter developer and problem solver based in the United States. 
                    My journey began with a fascination for how technology can transform ideas into reality, 
                    leading me to specialize in mobile app development and cutting-edge AI solutions.
                  </p>
                  <p>
                    I thrive on staying ahead of the curve in our rapidly evolving tech landscape. Whether it's 
                    building cross-platform mobile applications with Flutter or integrating AI capabilities 
                    into modern solutions, I'm passionate about leveraging the latest technologies to solve 
                    complex problems and create meaningful user experiences.
                  </p>
                  <p>
                    My approach combines technical expertise with continuous learning. I believe in adapting 
                    quickly to new technologies and methodologies, always seeking innovative ways to improve 
                    performance, user experience, and code quality. Every challenge is an opportunity to grow 
                    and push the boundaries of what's possible.
                  </p>
                </div>
              </div>

              {/* Experience Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-6 pt-6"
              >
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-3xl font-bold text-primary-700 dark:text-primary-400">3+</div>
                  <div className="text-sm text-gray-700 dark:text-gray-400">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-3xl font-bold text-primary-700 dark:text-primary-400">50+</div>
                  <div className="text-sm text-gray-700 dark:text-gray-400">Projects Completed</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Profile Image */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96">
                {/* Profile Image */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-full h-full rounded-2xl shadow-2xl relative overflow-hidden"
                >
                  <img
                    src={profilePicture}
                    alt="Ahmed Chebli"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-accent-600/10 rounded-2xl" />
                </motion.div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-primary-500 rounded-lg shadow-lg flex items-center justify-center"
                >
                  <Code2 size={24} className="text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent-500 rounded-lg shadow-lg flex items-center justify-center"
                >
                  <Palette size={24} className="text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-heading font-semibold text-gray-900 dark:text-white text-center mb-12">
              What I Bring to the Table
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 mx-auto mb-4 bg-primary-600 text-white rounded-lg flex items-center justify-center"
                    >
                      <IconComponent size={28} />
                    </motion.div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Technologies */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-heading font-semibold text-gray-900 dark:text-white text-center mb-12">
              Technologies I Work With
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(technologies).map(([category, techs], categoryIndex) => (
                <motion.div
                  key={category}
                  variants={itemVariants}
                  className="space-y-4"
                >
                  <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {techs.map((tech, techIndex) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (categoryIndex * 0.1) + (techIndex * 0.05) }}
                        whileHover={{ x: 5 }}
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
                      >
                        {tech}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
import { motion } from 'framer-motion'
import { 
  Code2, Database, Palette, Server, Smartphone, 
  Cloud, GitBranch, TestTube, Shield, Zap 
} from 'lucide-react'

const Skills = () => {
  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: Code2,
      color: 'from-blue-500 to-purple-600',
      skills: [
        { name: 'React/Next.js', level: 90 },
        { name: 'TypeScript', level: 85 },
        { name: 'Tailwind CSS', level: 90 },
        { name: 'Framer Motion', level: 80 }
      ]
    },
    {
      title: 'Backend Development',
      icon: Server,
      color: 'from-green-500 to-teal-600',
      skills: [
        { name: 'Node.js', level: 88 },
        { name: 'Python', level: 82 },
        { name: 'Express.js', level: 85 },
        { name: 'GraphQL', level: 75 }
      ]
    },
    {
      title: 'Database & Storage',
      icon: Database,
      color: 'from-orange-500 to-red-600',
      skills: [
        { name: 'MongoDB', level: 85 },
        { name: 'PostgreSQL', level: 80 },
        { name: 'Redis', level: 75 },
        { name: 'Supabase', level: 85 }
      ]
    },
    {
      title: 'Mobile Development',
      icon: Smartphone,
      color: 'from-pink-500 to-rose-600',
      skills: [
        { name: 'React Native', level: 82 },
        { name: 'Expo', level: 85 },
        { name: 'Flutter', level: 70 },
        { name: 'iOS/Android', level: 75 }
      ]
    },
    {
      title: 'Cloud & DevOps',
      icon: Cloud,
      color: 'from-indigo-500 to-blue-600',
      skills: [
        { name: 'AWS', level: 78 },
        { name: 'Docker', level: 80 },
        { name: 'Vercel', level: 90 },
        { name: 'CI/CD', level: 75 }
      ]
    },
    {
      title: 'Tools & Workflow',
      icon: GitBranch,
      color: 'from-teal-500 to-cyan-600',
      skills: [
        { name: 'Git/GitHub', level: 90 },
        { name: 'VS Code', level: 95 },
        { name: 'Figma', level: 80 },
        { name: 'Postman', level: 85 }
      ]
    }
  ]

  const achievements = [
    {
      icon: TestTube,
      title: 'Testing',
      description: 'Jest, Cypress, React Testing Library',
      color: 'text-green-600'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Authentication, Authorization, Best Practices',
      color: 'text-red-600'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Optimization, Web Vitals, Lighthouse',
      color: 'text-yellow-600'
    },
    {
      icon: Palette,
      title: 'UI/UX',
      description: 'Design Systems, Accessibility, Responsive',
      color: 'text-purple-600'
    }
  ]

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

  const progressVariants = {
    hidden: { width: 0 },
    visible: (level) => ({
      width: `${level}%`,
      transition: {
        duration: 1.5,
        ease: 'easeOut',
        delay: 0.5
      }
    })
  }

  return (
    <section id="skills" className="py-20 bg-white dark:bg-gray-900">
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
              Skills & Expertise
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
              A comprehensive overview of my technical skills and proficiency levels
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => {
              const IconComponent = category.icon
              return (
                <motion.div
                  key={category.title}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  {/* Category Header */}
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} text-white`}>
                      <IconComponent size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category.title}
                    </h3>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {skill.name}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <motion.div
                            variants={progressVariants}
                            custom={skill.level}
                            className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Additional Skills */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-heading font-semibold text-gray-900 dark:text-white text-center mb-12">
              Additional Expertise
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon
                return (
                  <motion.div
                    key={achievement.title}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.05 }}
                    className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 mx-auto mb-4 ${achievement.color} bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center`}
                    >
                      <IconComponent size={28} />
                    </motion.div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {achievement.title}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-400 text-sm">
                      {achievement.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Learning Path */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-heading font-semibold text-gray-900 dark:text-white mb-4">
              Currently Learning
            </h3>
            <p className="text-gray-700 dark:text-gray-400 mb-6">
              I'm always expanding my skillset and staying up-to-date with the latest technologies
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['AI/ML', 'Rust', 'WebAssembly', 'Kubernetes', 'GraphQL'].map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 rounded-lg font-medium hover:border-primary-400 dark:hover:border-primary-500 transition-colors duration-200"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
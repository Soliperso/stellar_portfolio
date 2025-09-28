import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, X, Calendar, Code, Users } from 'lucide-react'

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [filter, setFilter] = useState('all')

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      category: 'fullstack',
      description: 'A modern e-commerce platform built with React, Node.js, and MongoDB featuring real-time inventory management.',
      longDescription: 'A comprehensive e-commerce solution with user authentication, payment processing, inventory management, and admin dashboard. Features include real-time notifications, advanced search and filtering, and responsive design.',
      image: '/api/placeholder/600/400',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Socket.io'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
      date: '2024',
      team: 'Solo Project',
      duration: '3 months'
    },
    {
      id: 2,
      title: 'Task Management App',
      category: 'frontend',
      description: 'A collaborative task management application with real-time updates and team collaboration features.',
      longDescription: 'A feature-rich task management application that enables teams to collaborate effectively. Includes drag-and-drop functionality, real-time updates, deadline tracking, and team member assignment.',
      image: '/api/placeholder/600/400',
      tech: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS', 'Framer Motion'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
      date: '2024',
      team: '4 developers',
      duration: '2 months'
    },
    {
      id: 3,
      title: 'Weather Analytics Dashboard',
      category: 'fullstack',
      description: 'A data visualization dashboard for weather analytics with interactive charts and forecasting.',
      longDescription: 'An advanced weather analytics platform that provides detailed weather insights through interactive charts, historical data analysis, and AI-powered forecasting capabilities.',
      image: '/api/placeholder/600/400',
      tech: ['Next.js', 'Python', 'PostgreSQL', 'D3.js', 'AWS'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
      date: '2023',
      team: 'Solo Project',
      duration: '4 months'
    },
    {
      id: 4,
      title: 'Mobile Banking App',
      category: 'mobile',
      description: 'A secure mobile banking application with biometric authentication and real-time transactions.',
      longDescription: 'A cutting-edge mobile banking solution featuring biometric authentication, real-time transaction monitoring, budget tracking, and secure peer-to-peer payments.',
      image: '/api/placeholder/600/400',
      tech: ['React Native', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
      date: '2023',
      team: '6 developers',
      duration: '6 months'
    },
    {
      id: 5,
      title: 'AI Content Generator',
      category: 'ai',
      description: 'An AI-powered content generation tool that helps create marketing copy and blog posts.',
      longDescription: 'An intelligent content generation platform leveraging OpenAI GPT models to create high-quality marketing copy, blog posts, and social media content with customizable tone and style.',
      image: '/api/placeholder/600/400',
      tech: ['React', 'Python', 'OpenAI API', 'FastAPI', 'Supabase'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
      date: '2024',
      team: 'Solo Project',
      duration: '2 months'
    },
    {
      id: 6,
      title: 'Portfolio Website',
      category: 'frontend',
      description: 'A responsive portfolio website with 3D animations and dark mode support.',
      longDescription: 'A modern portfolio website showcasing projects and skills with interactive 3D elements, smooth animations, dark mode support, and optimized performance.',
      image: '/api/placeholder/600/400',
      tech: ['React', 'Three.js', 'Tailwind CSS', 'Framer Motion', 'Vite'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
      date: '2024',
      team: 'Solo Project',
      duration: '1 month'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'fullstack', name: 'Full Stack' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'ai', name: 'AI/ML' }
  ]

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter)

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
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
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
              Featured Projects
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
              A showcase of my recent work and creative solutions
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  filter === category.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => setSelectedProject(project)}
                  className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-400 to-accent-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-accent-600/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-2xl font-bold opacity-30">
                        {project.title.split(' ').map(word => word[0]).join('')}
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-4"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                      >
                        <ExternalLink size={20} className="text-white" />
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                      >
                        <Github size={20} className="text-white" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                        {project.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-400 text-sm mt-2">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="relative h-64 bg-gradient-to-br from-primary-400 to-accent-500">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 rounded-lg backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-200"
                >
                  <X size={24} />
                </button>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-accent-600/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-6xl font-bold opacity-30">
                    {selectedProject.title.split(' ').map(word => word[0]).join('')}
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                    {selectedProject.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400 text-lg">
                    {selectedProject.longDescription}
                  </p>
                </div>

                {/* Project Details */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-primary-600 dark:text-primary-400" size={20} />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Year</div>
                      <div className="font-medium text-gray-900 dark:text-white">{selectedProject.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="text-primary-600 dark:text-primary-400" size={20} />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Team</div>
                      <div className="font-medium text-gray-900 dark:text-white">{selectedProject.team}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Code className="text-primary-600 dark:text-primary-400" size={20} />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                      <div className="font-medium text-gray-900 dark:text-white">{selectedProject.duration}</div>
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <ExternalLink size={20} />
                    <span>View Live Project</span>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-600 hover:text-white rounded-lg transition-all duration-200"
                  >
                    <Github size={20} />
                    <span>View Source Code</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects
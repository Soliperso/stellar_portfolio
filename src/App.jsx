import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Contact from './sections/Contact'

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </Layout>
    </ThemeProvider>
  )
}

export default App

import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Roadmap } from './components/Roadmap'

export function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Roadmap />
      </main>
      <Footer />
    </div>
  )
}

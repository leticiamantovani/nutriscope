import { LandingPage } from '@/features/landing'
import { AppProviders } from './providers'

export default function App() {
  return (
    <AppProviders>
      <LandingPage />
    </AppProviders>
  )
}

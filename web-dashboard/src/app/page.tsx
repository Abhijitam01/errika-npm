import { HeroSection } from '@/components/HeroSection'
import { TemplateShowcase } from '@/components/TemplateShowcase'
import { FeaturesSection } from '@/components/FeaturesSection'
import { StatsSection } from '@/components/StatsSection'
import { CTASection } from '@/components/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TemplateShowcase />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </>
  )
}




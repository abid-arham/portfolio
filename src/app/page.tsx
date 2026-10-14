import { About } from "@/components/about"
import { Background } from "@/components/background"
import { Contact } from "@/components/contact"
import { Hero } from "@/components/hero"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { WorkSection } from "@/components/work/work-section"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <WorkSection />
        <About />
        <Background />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}

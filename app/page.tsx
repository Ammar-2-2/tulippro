import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TourPackages from '@/components/TourPackages';
import Blogs from '@/components/Blogs';
import Services from '@/components/Services';
import AboutSection from '@/components/About';
import ContactSection from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default async function HomePage() {


  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <TourPackages />
      <AboutSection />

      <Blogs />
      <ContactSection />
      <Footer />
    </main>
  );
}

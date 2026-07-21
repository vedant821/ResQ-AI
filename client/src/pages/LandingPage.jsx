import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Statistics from '../components/landing/Statistics';
import TriageSimulator from '../components/landing/TriageSimulator';
import FAQ from '../components/landing/FAQ';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Statistics />
      <TriageSimulator />
      <FAQ />
      <Footer />
    </div>
  );
}


import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import FeaturedExperiences from "@/components/home/FeaturedExperiences";
import VenueHighlight from "@/components/home/VenueHighlight";
import ExpansionMap from "@/components/home/ExpansionMap";
import CallToAction from "@/components/home/CallToAction";
import { Helmet } from 'react-helmet';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Immersify - Extraordinary Experiences</title>
        <meta name="description" content="Immerse yourself in extraordinary interactive worlds that blur the line between reality and imagination." />
      </Helmet>
      
      <div className="pt-16"> {/* Add padding for fixed navbar */}
        <Hero />
        <About />
        <FeaturedExperiences />
        <VenueHighlight />
        <div className="container my-20 mx-auto px-4">
          <ExpansionMap />
        </div>
        <CallToAction />
      </div>
    </>
  );
}

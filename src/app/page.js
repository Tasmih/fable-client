import Hero from "@/components/home/Hero";
import FeaturedEbooks from "@/components/home/FeaturedEbooks";
import WhyChooseFable from "@/components/home/WhyChooseFable";
import TopWriters from "@/components/home/TopWriters";
import EbookGenres from "@/components/home/EbookGenres";
import Testimonials from "@/components/home/Testimonials";
import PlatformStats from "@/components/home/PlatformStats";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6f1ea]">
      <Hero />

      <FeaturedEbooks />

      <WhyChooseFable />
      <PlatformStats />

      <TopWriters />

      <EbookGenres />

      <Testimonials />
    </main>
  );
}
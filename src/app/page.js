import FeaturedEbooks from "@/components/FeaturedEbooks";
import Hero from "@/components/Hero";
import WhyChooseFable from "@/components/WhyChooseFable";

import Image from "next/image";

export default function Home() {
  return (
    <div >
      <Hero/>
      <FeaturedEbooks/>
      <WhyChooseFable/>
    
    </div>
  );
}

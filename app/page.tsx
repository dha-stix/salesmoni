import { CallToAction } from "@/components/home/CallToAction";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Navbar } from "@/components/home/Navbar";
import { Reports } from "@/components/home/Reports";
import { pageMetadata } from "@/lib/site";

export const metadata = {
  ...pageMetadata({ title: "Sales records and stock control", path: "/" }),
  // The homepage keeps the full default title from the root layout.
  title: { absolute: "SalesMoni — Sales records and stock control" },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Reports />
        <CallToAction />
      </main>
    </>
  );
}

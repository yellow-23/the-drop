import HeroCTA from "../Components/HeroCTA";
import Footer from "../Components/Footer";
import SloganTitle from "../Components/SloganTitle";
import HowItWorks from "../Components/HowItWorks";
import ImpactBanner from "../Components/ImpactBanner";

function Home() {
  return (
    <>
    <main className="pt-4">
      <HeroCTA />
      <SloganTitle />
      <HowItWorks />
      <ImpactBanner />
      <Footer />
      </main>
    </>
  );
}

export default Home;

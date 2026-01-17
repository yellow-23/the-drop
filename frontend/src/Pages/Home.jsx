import HeroCTA from "../Components/HeroCTA";
import Footer from "../Components/Footer";
import SloganTitle from "../Components/SloganTitle";
import HowItWorks from "../Components/HowItWorks";
import StatsBanner from "../Components/StatsBanner";

function Home() {
  return (
    <>
    <main className="pt-4">
      <HeroCTA />
      <SloganTitle />
      <HowItWorks />
      <StatsBanner />
      <Footer />
      </main>
    </>
  );
}

export default Home;

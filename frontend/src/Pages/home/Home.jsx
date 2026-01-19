import HeroCTA from "../../Components/home/HeroCTA";
import Footer from "../../Components/layout/Footer";
import SloganTitle from "../../Components/home/SloganTitle";
import HowItWorks from "../../Components/home/HowItWorks";
import StatsBanner from "../../Components/home/StatsBanner";

function Home() {
  return (
    <>
    <main>
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

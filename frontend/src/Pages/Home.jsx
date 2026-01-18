import HeroCTA from "../Components/HeroCTA";
import Footer from "../Components/Footer";
import SloganTitle from "../Components/SloganTitle";
import HowItWorks from "../Components/HowItWorks";
import StatsBanner from "../Components/statsBanner";

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

import HeroCTA from "../Components/HeroCTA";
import Footer from "../Components/Footer";
import SloganTitle from "../Components/SloganTitle";
import HowItWorks from "../Components/HowItWorks";

function Home() {
  return (
    <>
    <main className="pt-4">
      <HeroCTA />
      <SloganTitle />
      <HowItWorks />
      <Footer />
      </main>
    </>
  );
}

export default Home;

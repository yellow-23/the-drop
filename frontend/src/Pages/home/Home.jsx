import HeroCTA from "../../Components/home/HeroCTA";
import Footer from "../../Components/layout/Footer";
import SloganTitle from "../../Components/home/SloganTitle";
import HowItWorks from "../../Components/home/HowItWorks";

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

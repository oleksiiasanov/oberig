import { Header } from "./components/Header.jsx";
import { Hero } from "./components/Hero.jsx";
import { MarketProblem } from "./components/MarketProblem.jsx";
import { SdrDifference } from "./components/SdrDifference.jsx";
import { Modes } from "./components/Modes.jsx";
import { Capabilities } from "./components/Capabilities.jsx";
import { UnknownSpecs } from "./components/UnknownSpecs.jsx";
import { MarketComparison } from "./components/MarketComparison.jsx";
import { Trust } from "./components/Trust.jsx";
import { FAQ } from "./components/FAQ.jsx";
import { FinalCTA } from "./components/FinalCTA.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MarketProblem />
        <SdrDifference />
        <Modes />
        <Capabilities />
        <UnknownSpecs />
        <MarketComparison />
        <Trust />
        <FAQ />
        <FinalCTA />
      </main>
    </>
  );
}

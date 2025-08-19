import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustTags from "./components/TrustTags";
import Form from "./components/Form";
import BottomActions from "./components/BottomActions";
import Footer from "./components/Footer";
import CompanyLogos from "./components/CompanyLogos";

function App() {
  return (
    <div className="min-h-screen gradient-bg">
      <Header />

      <main className="container mx-auto px-4 py-8 lg:py-12">
        {/* Mobile Layout - Single Column */}
        <div className="lg:hidden space-y-8">
          <Hero />
          <TrustTags />
          <CompanyLogos />
          <Form />
        </div>

        {/* Desktop Layout - Two Columns */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          <div className="space-y-8">
            <Hero />
            <TrustTags />
            <CompanyLogos />
          </div>
          <div className="sticky top-8">
            <Form />
          </div>
        </div>
      </main>

      <BottomActions />
      <Footer />
    </div>
  );
}

export default App;

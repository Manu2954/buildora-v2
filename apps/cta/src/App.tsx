import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustTags from "./components/TrustTags";
import Form from "./components/Form";
import Banner from "./components/Banner";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-bg-base fade-in">
      <Header />

      <main className="px-4 py-8 lg:px-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Desktop: Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column: Hero + Trust Tags */}
            <div className="space-y-8 lg:space-y-12">
              <Hero />
              <TrustTags />
            </div>

            {/* Right Column: Form */}
            <div className="lg:sticky lg:top-8">
              <Form />
            </div>
          </div>
        </div>
      </main>

      <Banner />
      <Footer />
    </div>
  );
}

export default App;

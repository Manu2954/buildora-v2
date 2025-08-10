import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustTags from "./components/TrustTags";
import Form from "./components/Form";
import Banner from "./components/Banner";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen gradient-bg">
      <Header />

      <main className="container mx-auto px-4 py-8 lg:py-12">
        {/* Mobile Layout - Single Column */}
        <div className="lg:hidden space-y-8">
          <Hero />
          <TrustTags />
          <Form />
        </div>

        {/* Desktop Layout - Two Columns */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          <div className="space-y-8">
            <Hero />
            <TrustTags />
          </div>
          <div className="sticky top-8">
            <Form />
          </div>
        </div>
      </main>

      <Banner />
      <Footer />
    </div>
  );
}

export default App;

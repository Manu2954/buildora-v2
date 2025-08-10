import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustTags from "./components/TrustTags";
import Form from "./components/Form";
import Banner from "./components/Banner";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 lg:py-16 lg:flex lg:items-start lg:gap-12 fade-in">
        <div className="lg:w-1/2 space-y-8">
          <Hero />
          <div className="lg:hidden">
            <Form />
          </div>
          <TrustTags />
        </div>
        <div className="hidden lg:block lg:w-1/2">
          <div className="sticky top-8">
            <Form />
          </div>
        </div>
      </main>
      <Banner />
    </div>
  );
}

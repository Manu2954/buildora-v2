import { useState } from "react";

function BottomActions() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid gap-6 lg:grid-cols-2 mb-12">
        <a
          href="https://buildoraenterprise.com/designs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-brand-gold hover:bg-gray-50 hover:shadow-md hover:-translate-y-1 transform transition-all"
        >
          <svg
            className="w-8 h-8 text-brand-gold pointer-events-none"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6z" />
          </svg>
          <span className="font-semibold text-text-base">Explore Designs</span>
        </a>
        <a
          href="https://buildoraenterprise.com/products"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-brand-gold hover:bg-gray-50 hover:shadow-md hover:-translate-y-1 transform transition-all"
        >
          <svg
            className="w-8 h-8 text-brand-gold pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2l8 4-8 4-8-4 8-4z" />
            <path d="M4 6v8l8 4 8-4V6" />
            <path d="M12 10v8" />
          </svg>
          <span className="font-semibold text-text-base">Explore Products</span>
        </a>
      </div>
      <div className="max-w-md mx-auto">
        {subscribed && (
          <div className="mb-4 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg text-center">
            Subscribed! We’ll keep you posted.
          </div>
        )}
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
          <label htmlFor="subscribe-email" className="sr-only">
            Email
          </label>
          <input
            id="subscribe-email"
            type="email"
            required
            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="form-input flex-1"
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

export default BottomActions;

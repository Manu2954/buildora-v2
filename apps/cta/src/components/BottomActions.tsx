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
          href="https://buildoraenterprise.com/packages"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-brand-gold hover:shadow-md hover:-translate-y-1 transform transition-transform"
        >
          <svg
            className="w-8 h-8 text-brand-gold pointer-events-none"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6z" />
          </svg>
          <span className="font-semibold text-text-base">See Packages</span>
        </a>
        <a
          href="https://buildoraenterprise.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-brand-gold hover:shadow-md hover:-translate-y-1 transform transition-transform"
        >
          <svg
            className="w-8 h-8 text-brand-gold pointer-events-none"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3 10a1 1 0 011-1h8.586l-3.293-3.293 1.414-1.414 6 6-6 6-1.414-1.414L12.586 11H4a1 1 0 01-1-1z" />
          </svg>
          <span className="font-semibold text-text-base">Go to the Website</span>
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

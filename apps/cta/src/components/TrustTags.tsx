const tags = [
  {
    text: "Trusted by 50+ dealers",
    sub: "& professionals",
    color: "from-blue-500 to-blue-600"
  },
  {
    text: "Verified Manufacturer",
    sub: "Partner",
    color: "from-green-500 to-green-600"
  },
  {
    text: "Fast Delivery",
    sub: "Best Prices",
    color: "from-purple-500 to-purple-600"
  },
  {
    text: "South India",
    sub: "Coverage",
    color: "from-orange-500 to-orange-600"
  }
];

export default function TrustTags() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {tags.map(({ text, sub, color }) => (
        <div
          key={text}
          className={`rounded-2xl p-4 text-white flex items-center gap-3 bg-gradient-to-r ${color}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 flex-shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div className="leading-tight">
            <p className="font-medium">{text}</p>
            <p className="text-sm opacity-90">{sub}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

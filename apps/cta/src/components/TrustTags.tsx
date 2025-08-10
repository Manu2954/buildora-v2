const tags = [
  {
    text: "Trusted by 50+ dealers & professionals"
  },
  {
    text: "Verified Manufacturer Partner"
  },
  {
    text: "Fast Delivery | Best Prices | South India Coverage"
  }
];

export default function TrustTags() {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {tags.map((tag) => (
        <div
          key={tag.text}
          className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-2 text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 text-brand-gold"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{tag.text}</span>
        </div>
      ))}
    </section>
  );
}

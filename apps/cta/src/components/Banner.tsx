function Banner() {
  return (
    <section className="w-full">
      {/* TODO: Replace with /public/banner.jpg after deployment */}
      <img
        src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=60"
        alt="Modern interior design showcase"
        className="w-full h-48 lg:h-64 object-cover"
        draggable="false"
      />
    </section>
  );
}

export default Banner;

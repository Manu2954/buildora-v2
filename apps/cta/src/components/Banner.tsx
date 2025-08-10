function Banner() {
  return (
    <div className="w-full mt-12 lg:mt-16">
      {/* TODO: Replace this remote URL with /public/banner.jpg after manual upload */}
      <img
        src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=60"
        alt="Buildora Enterprise Interior Design Project"
        className="w-full h-32 md:h-48 lg:h-64 object-cover"
        draggable="false"
      />
    </div>
  )
}

export default Banner

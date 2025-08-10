function Header() {
  return (
    <header className="py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-center space-x-4">
          {/* BE Monogram */}
          <div className="logo">
            <img
              src="/logo-monogram.svg"
              alt="BE Monogram"
              className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20"
              draggable="false"
            />
          </div>

          {/* Buildora Enterprise Wordmark */}
          <div className="logo">
            <img
              src="/logo-wordmark.svg"
              alt="Buildora Enterprise"
              className="h-8 md:h-10 lg:h-12 w-auto"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

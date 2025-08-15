function Header() {
  return (

    <header className="bg-white border-b border-gray-200 shadow-sm">

    <header className="bg-white border-b border-gray-200">

      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img
            src="/logo-monogram.svg"
            alt="BE"
            className="h-10 w-10"
            draggable="false"
          />
          <img
            src="/logo-wordmark.svg"
            alt="Buildora Enterprise"
            className="h-8"
            draggable="false"
          />
        </a>

        <nav className="flex items-center gap-4">

        <nav className="flex items-center gap-6 text-sm">

          <a
            href="https://buildoraenterprise.com/about"
            target="_blank"
            rel="noopener noreferrer"

            className="nav-link"

            className="text-text-base hover:text-brand-gold"

          >
            About Us
          </a>
          <a
            href="https://buildoraenterprise.com"
            target="_blank"
            rel="noopener noreferrer"

            className="nav-link"
          >
            Go to the Website

            className="text-text-base hover:text-brand-gold"
          >
            Go to the website

          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;

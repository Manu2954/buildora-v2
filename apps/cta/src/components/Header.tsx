function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <img
            src="/logo-monogram.svg"
            alt="Buildora Enterprise"
            className="h-10 w-10"
            draggable="false"
          />
          <img
            src="/logo-wordmark.svg"
            alt="Buildora Enterprise"
            className="h-8"
            draggable="false"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;

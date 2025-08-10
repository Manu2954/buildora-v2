export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="https://placehold.co/40x40/C69B4B/FFFFFF?text=BE"
            alt="Buildora Enterprise monogram"
            draggable="false"
            className="h-10 w-auto select-none"
          />
          <img
            src="https://placehold.co/200x40/C69B4B/FFFFFF?text=Buildora%20Enterprise"
            alt="Buildora Enterprise"
            draggable="false"
            className="h-6 w-auto select-none"
          />
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#333132]">
          <a href="#" className="hover:text-brand-gold transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-brand-gold transition-colors">
            Products
          </a>
          <a href="#" className="hover:text-brand-gold transition-colors">
            About
          </a>
          <a href="#" className="hover:text-brand-gold transition-colors">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

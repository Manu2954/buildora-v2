export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#333132]">
        <nav className="flex flex-wrap justify-center gap-4">
          <a href="#" className="hover:text-brand-gold transition-colors">
            About
          </a>
          <a href="#" className="hover:text-brand-gold transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-brand-gold transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-brand-gold transition-colors">
            Contact
          </a>
        </nav>
        <p className="text-center md:text-right w-full md:w-auto">
          &copy; {new Date().getFullYear()} Buildora Enterprise. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

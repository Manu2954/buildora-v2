export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
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
    </header>
  );
}

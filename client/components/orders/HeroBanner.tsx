import { cn } from "@/lib/utils";

interface HeroBannerProps {
  imageUrl: string;
  className?: string;
}

export function HeroBanner({ imageUrl, className }: HeroBannerProps) {
  return (
    <section className={cn("relative w-full overflow-hidden rounded-[24px] shadow-[0_6px_20px_rgba(0,0,0,0.08)]", className)}>
      <img
        src={imageUrl}
        alt="Elegant interior banner"
        loading="eager"
        className="h-[220px] md:h-[320px] w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex items-end md:items-center">
        <div className="w-full p-6 md:p-10">
          <h1 className="text-white text-2xl md:text-4xl font-bold tracking-tight">My Interior Projects</h1>
          <p className="text-white/90 md:text-white/80 text-sm md:text-base mt-2 max-w-xl">
            Track and manage your interiors with Buildora
          </p>
        </div>
      </div>
    </section>
  );
}

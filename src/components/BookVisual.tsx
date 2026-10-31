import Image from "next/image";
import type { PublicBook } from "@/content/book";

/** The real first-edition cover of one edition, floating in the void with a soft spine, a shadow and a lantern glow. */
export function BookVisual({
  b,
  alt,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 70vw, 380px",
}: {
  b: PublicBook;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={`lantern-glow relative ${className}`}>
      <div aria-hidden className="absolute inset-x-[8%] bottom-[-6%] h-[14%] rounded-[50%] bg-black/55 blur-2xl" />
      <div className="animate-float relative" style={{ animationDuration: "10s" }}>
        <div className="relative overflow-hidden rounded-[10px] bg-[#16130f] shadow-[0_50px_90px_-30px_rgba(8,5,2,0.85),0_18px_36px_-18px_rgba(8,5,2,0.7)] ring-1 ring-white/10">
          <Image
            src={b.cover.image}
            alt={alt}
            width={b.cover.width}
            height={b.cover.height}
            priority={priority}
            sizes={sizes}
            className="block h-auto w-full"
          />
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[5%] bg-gradient-to-r from-white/12 via-white/5 to-transparent" />
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-[5%] w-px bg-black/30" />
        </div>
      </div>
    </div>
  );
}

export function LookInside({ b, caption }: { b: PublicBook; caption: (page: number) => string }) {
  return (
    <div className="-mx-3 overflow-x-auto px-3 pb-4 [scrollbar-width:none] sm:-mx-5 sm:px-5">
      <ul className="flex w-max gap-4 sm:gap-6">
        {b.lookInside.map((p) => (
          <li key={p.page} className="w-[240px] sm:w-[280px]">
            <figure className="slab slab-hover overflow-hidden p-3">
              <div className="overflow-hidden rounded-[14px] bg-[#f7f4ef] ring-1 ring-black/5">
                <Image src={p.image} alt={`${caption(p.page)}: ${p.label}`} width={900} height={1350} sizes="280px" loading="lazy" className="block h-auto w-full" />
              </div>
              <figcaption className="px-1 pb-1 pt-3">
                <p className="text-[0.95rem] font-semibold text-ink">{p.label}</p>
                <p className="text-[0.82rem] text-ink-3">{caption(p.page)}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

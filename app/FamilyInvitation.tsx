import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export default function FamilyInvitation() {
  return (
    <section
      id="family-invitation"
      className="relative z-10 scroll-mt-24 bg-background px-6 py-14 md:py-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-pink text-sm font-light tracking-[0.28em] uppercase mb-6">
          With joy &amp; gratitude
        </p>

        <blockquote
          className={`${playfair.className} text-foreground text-xl font-normal italic leading-relaxed md:text-2xl md:leading-relaxed lg:text-[1.65rem]`}
        >
          The families of{" "}
          <span className="font-semibold not-italic">Mr. &amp; Mrs. Gbadamosi</span> and{" "}
          <span className="font-semibold not-italic">Mr. &amp; Mrs. Robinson Oriakhi</span> invite you all
          to our children&apos;s wedding.
        </blockquote>

        <div className="mx-auto mt-10 flex w-full max-w-xs items-center justify-center gap-3" aria-hidden>
          <span className="h-px flex-1 bg-[#D4AF37]/45" />
          <span className="text-pink text-lg">♥</span>
          <span className="h-px flex-1 bg-[#D4AF37]/45" />
        </div>
      </div>
    </section>
  );
}

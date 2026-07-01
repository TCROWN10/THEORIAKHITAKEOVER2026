const HOTELS = [
  { name: "Academy Suit", phone: "08176666602", tel: "+2348176666602" },
  { name: "Plams 77", phone: "08188422222", tel: "+2348188422222" },
  { name: "Carlton Gate", phone: "08126236287", tel: "+2348126236287" },
  { name: "Waterfield Hotel, Akobo", phone: "07033307129", tel: "+2347033307129" },
] as const;

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

export default function HotelContacts() {
  return (
    <div className="w-full rounded-2xl border border-[#E3EAF3] bg-[#F8FBFF] px-6 py-8 shadow-sm md:px-10 md:py-10">
      <p className="text-center font-serif text-xl font-medium text-foreground md:text-2xl">
        Nearby Hotels
      </p>
      <p className="mt-1 text-center text-sm font-light text-text-muted md:text-base">
        For accommodation enquiries
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-[#E3EAF3] bg-white/70">
        <div className="grid grid-cols-[1fr_auto] gap-x-6 border-b border-[#E3EAF3] bg-[#F8FBFF] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground md:px-6 md:text-sm">
          <span>Hotel name</span>
          <span>Number</span>
        </div>
        <ul className="divide-y divide-[#E3EAF3]">
          {HOTELS.map((hotel) => (
            <li
              key={hotel.tel}
              className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 px-5 py-4 md:px-6 md:py-4"
            >
              <span className="text-base font-medium leading-snug text-foreground md:text-lg">
                {hotel.name}
              </span>
              <a
                href={`tel:${hotel.tel}`}
                className="inline-flex items-center gap-2 whitespace-nowrap text-base font-light text-text-muted transition-colors hover:text-foreground md:text-lg"
              >
                <PhoneIcon className="h-4 w-4 shrink-0" />
                {hotel.phone}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

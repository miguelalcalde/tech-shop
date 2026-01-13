export default function DiscountBanner() {
  return (
    <div className="bg-yellow-400 text-black p-2 overflow-hidden whitespace-nowrap border-b-4 border-black">
      <div className="animate-marquee inline-flex">
        {Array.from({ length: 8 }).map((_, i) => (
          <p key={i} className="font-black text-lg uppercase mx-4">
            Enjoy Special Offers This Weekend! 🎉
          </p>
        ))}
      </div>
    </div>
  )
}


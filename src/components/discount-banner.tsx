export default function DiscountBanner() {
  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden whitespace-nowrap border-b border-border">
      <div className="animate-marquee inline-flex">
        {Array.from({ length: 8 }).map((_, i) => (
          <p key={i} className="text-sm font-medium mx-6">
            Enjoy Special Offers This Weekend
          </p>
        ))}
      </div>
    </div>
  )
}


import { Header as UIHeader } from "@/components/acme"
import SearchBar from "./SearchBar"
import CartPopover from "./cart-popover"
import { bannerFlag } from "@/flags"
import DiscountBanner from "./discount-banner"

export default async function Header() {
  const showBanner = await bannerFlag()

  const navItems = [
    { label: "Blog", href: "/blog" },
    { label: "Deals", href: "/deals" },
    { label: "About", href: "/about" },
  ]

  return (
    <UIHeader
      logoText="ACME"
      logoHref="/"
      navItems={navItems}
      showBanner={showBanner}
      bannerContent={showBanner ? <DiscountBanner /> : null}
      rightContent={
        <>
          <SearchBar />
          <CartPopover />
        </>
      }
    />
  )
}

// Blog layout for ISR pages
// Note: Draft mode detection is handled by the client components
// We don't call draftMode() here to keep pages ISR-compatible
export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}

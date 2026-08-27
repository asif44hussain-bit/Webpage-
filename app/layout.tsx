export const metadata = {
  title: "CLOVEKICK",
  description: "Original streetwear. Limited drops.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

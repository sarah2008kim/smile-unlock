export const metadata = {
  title: 'Smile Unlock',
  description: 'Unlock with your smile!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

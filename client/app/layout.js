import "./globals.css";
import MainLayouts from "@/components/Layouts/mainLayouts";

export const metadata = {
  title: "Ticketing website",
  description: "Buy Tickets for your favorite events",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MainLayouts>{children}</MainLayouts>
      </body>
    </html>
  );
}

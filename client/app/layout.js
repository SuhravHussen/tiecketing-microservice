import { GlobalContextProvider } from "@/context/store";
import "./globals.css";
import MainLayouts from "@/components/Layouts/mainLayouts";
import { headers } from "next/headers";
export const metadata = {
  title: "Ticketing website",
  description: "Buy Tickets for your favorite events",
};

async function getData() {
  try {
    if (typeof window === "undefined") {
      const res = await fetch(
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
        {
          credentials: "include",
          cache: "no-store",
          headers: headers(),
        }
      );
      return await res.json();
    } else {
      const res = await fetch("/api/users/currentuser", {
        cache: "no-store",
        credentials: "include",
      });

      return await res.json();
    }
  } catch (e) {
    return {
      data: {
        email: null,
        id: null,
      },
      error: true,
      message: e.message ? e.message : "Something went wrong",
    };
  }
}

export default async function RootLayout({ children }) {
  const user = await getData();
  console.log(user);
  return (
    <html lang="en">
      <body>
        <GlobalContextProvider userData={user.data}>
          <MainLayouts>{children}</MainLayouts>
        </GlobalContextProvider>
      </body>
    </html>
  );
}

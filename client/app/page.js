import Card from "@/components/tickets/card";
import { headers } from "next/headers";

async function getTickets() {
  try {
    const tickets = await fetch(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/tickets/all",
      {
        credentials: "include",
        cache: "no-store",
        headers: headers(),
      }
    );
    return await tickets.json();
  } catch (e) {
    return {
      data: [],
      error: true,
      message: e.message ? e.message : "Something went wrong",
    };
  }
}

export default async function Home() {
  const tickets = await getTickets();

  return (
    <div className="flex justify-center items-center  flex-col">
      <h1 className="font-extrabold text-transparent  text-align: center text-4xl sm:text-6xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Tickets
      </h1>
      <hr class="h-px my-8 bg-gray-800 border-2 dark:bg-gray-700 w-full"></hr>
      <div className="flex justify-center items-center flex-wrap gap-5">
        {tickets &&
          tickets?.data?.map((ticket) => (
            <Card key={ticket.id} ticket={ticket} />
          ))}
      </div>
    </div>
  );
}

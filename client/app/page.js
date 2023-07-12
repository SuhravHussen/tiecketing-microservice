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
        {data.map((ticket) => (
          <Card key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}

const data = [
  {
    title: "zamshed majumdar",
    price: 10,
    userId: "64ae4103e94f55d8f70fe69e",
    createdAt: "2023-07-12T05:59:07.170Z",
    updatedAt: "2023-07-12T05:59:07.170Z",
    version: 0,
    id: "64ae412b606262d1c107b58e",
  },
  {
    title: "ahmadullah",
    price: 10,
    userId: "64ae4103e94f55d8f70fe69e",
    createdAt: "2023-07-12T05:59:23.335Z",
    updatedAt: "2023-07-12T05:59:23.335Z",
    version: 0,
    id: "64ae413b606262d1c107b590",
  },
  {
    title: "madani",
    price: 10,
    userId: "64ae4103e94f55d8f70fe69e",
    createdAt: "2023-07-12T05:59:36.345Z",
    updatedAt: "2023-07-12T05:59:36.345Z",
    version: 0,
    id: "64ae4148606262d1c107b592",
  },
  {
    title: "enamul haque",
    price: 10,
    userId: "64ae4103e94f55d8f70fe69e",
    createdAt: "2023-07-12T06:00:00.455Z",
    updatedAt: "2023-07-12T06:00:00.455Z",
    version: 0,
    id: "64ae4160606262d1c107b594",
  },
  {
    title: "saifuddin",
    price: 10,
    userId: "64ae4103e94f55d8f70fe69e",
    createdAt: "2023-07-12T06:00:14.406Z",
    updatedAt: "2023-07-12T06:00:14.406Z",
    version: 0,
    id: "64ae416e606262d1c107b596",
  },
  {
    title: "shamsul arefien",
    price: 10,
    userId: "64ae4103e94f55d8f70fe69e",
    createdAt: "2023-07-12T06:00:22.971Z",
    updatedAt: "2023-07-12T06:00:22.971Z",
    version: 0,
    id: "64ae4176606262d1c107b598",
  },
];

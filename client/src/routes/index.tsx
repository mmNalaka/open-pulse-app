import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { hcWithType } from "server/dist/client";
import beaver from "@/assets/beaver.svg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const client = hcWithType(SERVER_URL);

type ResponseType = Awaited<ReturnType<typeof client.health.metrics.$get>>;

function Index() {
  const [data, setData] = useState<Awaited<ReturnType<ResponseType["json"]>> | undefined>();

  const { mutate: sendRequest } = useMutation({
    mutationFn: async () => {
      try {
        const res = await client.health.metrics.$get();
        if (!res.ok) {
          console.log("Error fetching data");
          return;
        }
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6">
      <a href="https://github.com/stevedylandev/bhvr" rel="noopener" target="_blank">
        <img alt="beaver logo" className="h-16 w-16 cursor-pointer" src={beaver} />
      </a>
      <h1 className="font-black text-5xl">bhvr</h1>
      <h2 className="font-bold text-2xl">Bun + Hono + Vite + React</h2>
      <p>A typesafe fullstack monorepo</p>
      <div className="flex items-center gap-4">
        <Button onClick={() => sendRequest()}>Call API</Button>
        <Button asChild variant="secondary">
          <a href="https://bhvr.dev" rel="noopener" target="_blank">
            Docs
          </a>
        </Button>
      </div>
      {data && (
        <pre className="rounded-md bg-gray-100 p-4">
          <code>
            Status: {data.status} <br />
          </code>
        </pre>
      )}
    </div>
  );
}

export default Index;

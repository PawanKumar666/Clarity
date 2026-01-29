import { notFound } from "next/navigation";
import DevTools from "@/app/components/DevTools";

export default function DevPage({
  searchParams
}: {
  searchParams: { dev?: string };
}) {
  if (searchParams.dev !== "1") {
    notFound();
  }

  return (
    <main className="container pb-16 pt-12">
      <DevTools />
    </main>
  );
}

import { Toaster } from "@/components/ui/toaster";
import Content from "./content";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between ">
      <Content />
      <Toaster />
    </main>
  );
}

import { Outlet } from "react-router";
import Sidebar from "~/components/Sidebar";

export default function Home2() {
  return (
    <div className="flex h-screen gradient-background">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center p-6 bg-white/80 backdrop-blur-sm">
        <Outlet />
      </main>
    </div>
  );
}
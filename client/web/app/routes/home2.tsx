import { Outlet } from "react-router";
import Sidebar from "~/components/Sidebar";
import { ShieldCheck } from "lucide-react";
import { BioVaultLogo } from "../components/BioVaultLogo";

export default function Home2() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 overflow-auto">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md rounded-2xl border border-purple-200">
          <div className="flex items-center gap-3">
            <BioVaultLogo size="small" />
            <h1 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
              {/* <ShieldCheck className="h-6 w-6 text-purple-600" /> */}
              BioVault
            </h1>
          </div>
        </div>

        {/* Main Card */}
        <div className="flex-1 flex items-center justify-center mt-6">
          <div className="w-full max-w-5xl h-[85vh] rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-purple-200 p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

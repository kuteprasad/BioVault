import { Database, Shield } from "lucide-react";

export const BioVaultLogo = () => {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <Shield className="w-24 h-24 text-purple-500 absolute animate-pulse" />
      <Database className="w-12 h-12 text-white absolute" />
    </div>
  );
};
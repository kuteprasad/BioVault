import { Database, Shield } from "lucide-react";

interface BioVaultLogoProps {
  size?: "small" | "medium" | "large";
}

export const BioVaultLogo: React.FC<BioVaultLogoProps> = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-12 h-12 text-purple-500",
    medium: "w-16 h-16 text-purple-500",
    large: "w-24 h-24 text-purple-500",
  };

  const iconSizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      <Shield className={`absolute animate-pulse ${sizeClasses[size]}`} />
      <Database className={`absolute text-white ${iconSizeClasses[size]}`} />
    </div>
  );
};

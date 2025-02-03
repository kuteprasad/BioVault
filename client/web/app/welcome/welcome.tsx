import { useNavigate } from "react-router";
import { BioVaultLogo } from "../components/BioVaultLogo";
import { motion } from "framer-motion";

export function Welcome() {
  const navigate = useNavigate();

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center gap-8 p-12 bg-white rounded-2xl shadow-lg max-w-md w-full mx-4"
      >
        {/* Logo */}
        <div className="mb-4">
          <BioVaultLogo size="large" />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            BioVault
          </h1>
          <p className="text-gray-600">Be Safe, Be Secure, Use BioVault</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
          <button
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-md"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
          <button
            className="w-full px-6 py-3 bg-white text-purple-600 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors font-medium"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </div>
      </motion.div>
    </main>
  );
}
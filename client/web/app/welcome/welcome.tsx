import { useNavigate } from "react-router";
import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";

export function Welcome() {
  const navigate = useNavigate();

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center text-center gap-8 p-8 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-lg">
        {/* Logo */}
        <div className="w-[300px]">
          <img
            src={logoLight}
            alt="BioVault"
            className="block w-full dark:hidden"
          />
          <img
            src={logoDark}
            alt="BioVault"
            className="hidden w-full dark:block"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          BioVault
        </h1>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
          <button
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </div>
      </div>
    </main>
  );
}

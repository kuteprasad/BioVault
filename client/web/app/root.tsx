import { Provider } from 'react-redux';
import store from './redux/store';
import { Toaster } from 'sonner';
import { getToken } from './utils/authUtils';
import { logout } from './redux/authSlice';
import { useEffect } from 'react';

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>BioVault</title>
        <Meta />
        <Links />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="BioVault" />
        <link rel="manifest" href="/site.webmanifest" />

      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AppWithAuth() {
  useEffect(() => {
    // Check token on app initialization
    const token = getToken();
    if (!token) {
      store.dispatch(logout());
    }
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
      />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppWithAuth />
    </Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let message = "Oops! Something went wrong.";
  let details = "";
  let stack = null;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
        <div className="flex justify-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-purple-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">{message}</h1>

        <p className="text-lg text-gray-600">{details}</p>

        {stack && (
          <pre className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-left overflow-x-auto text-sm">
            <code className="text-gray-700">{stack}</code>
          </pre>
        )}

        <a
          href="/"
          className="mt-8 inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 
            text-white font-medium rounded-lg transition-colors duration-200"
        >
          Return to Home
        </a>
      </div>
    </main>
  );
}

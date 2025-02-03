import {
    type RouteConfig,
    route,
    index,
    layout,
} from "@react-router/dev/routes";
import ProtectedRoutes from "./components/ProtectedRoutes";

export default [
    route("signup", "./auth/signup.tsx"),
    route("login", "./auth/login.tsx"),
    route("add-biometrics", "./auth/addBiometrics.tsx"),

    // Unauthenticated home page
    index("./routes/home1.tsx"),

    // Authenticated routes wrapped inside ProtectedRoutes
    layout("./components/ProtectedRoutes.tsx", [
        layout("./routes/home2.tsx", [
            index("./routes/home/viewVaults.tsx"), // Default page when Home2 loads
            route("update-profile", "./routes/home/updateProfile.tsx"),
            route("settings", "./routes/home/settings.tsx"),
            route("import-passwords", "./routes/home/importPasswords.tsx"),
        ]),
    ]),
] satisfies RouteConfig;

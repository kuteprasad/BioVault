import type { Route } from "./+types/home2";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BioVault" },
    { name: "description", content: "Welcome to BioVault!" },
  ];
}

export default function Home() {
  return <Welcome />;
}

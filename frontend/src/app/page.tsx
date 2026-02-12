"use client";

import useSocket from "../hooks/useSocket";

export default function Home() {
  // Connexion au serveur
  useSocket("http://localhost:4000");

  return (
    <main>
      <h1>Bienvenue sur le projet Rituels</h1>
    </main>
  );
}

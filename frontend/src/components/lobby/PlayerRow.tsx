"use client";

import { useState } from "react";
import Image from "next/image";

import { useGame } from "../../context/GameContext";
import { Player } from "../../types/game";
import { MAX_NAME_LENGTH } from "../../utils/gameConstants";

const fondClass =
  "pointer-events-none absolute inset-0 z-0 h-full w-full object-fill select-none";

// Emplacement libre dans la liste des joueurs
export function EmptySlot() {
  return (
    <li className="relative flex w-full cursor-default items-center justify-center rounded-full py-4 text-3xl">
      <Image
        src="/assets/button-long-border.png"
        alt=""
        width={800}
        height={100}
        className={fondClass}
      />
      <span className="relative z-15 text-4xl text-white">
        En attente de joueurs...
      </span>
    </li>
  );
}

// Ligne d'un joueur ; le joueur local peut cliquer dessus pour changer son pseudo
export default function PlayerRow({ player }: { player: Player }) {
  const { socket, changeName, setError } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  const isMe = player.id === socket?.id;
  const isOn = player.isHost || player.isReady;

  const commitName = () => {
    setIsEditing(false);
    const trimmed = editName.trim();
    if (trimmed === player.name) return;

    if (trimmed !== "" && trimmed.length <= MAX_NAME_LENGTH) {
      changeName(trimmed);
    } else {
      setEditName(player.name);
      setError(`Le nom doit contenir entre 1 et ${MAX_NAME_LENGTH} caractères.`);
    }
  };

  return (
    <li
      className={`relative flex w-full items-center justify-center rounded-full py-4 text-3xl transition-shadow duration-300 hover:shadow-lg hover:shadow-black ${isMe ? "cursor-pointer" : "pointer-events-none"}`}
      onClick={() => {
        if (isMe && !isEditing) {
          setIsEditing(true);
          setEditName(player.name);
        }
      }}
    >
      <Image
        src={
          isOn
            ? "/assets/button-long-green.png"
            : "/assets/button-long-red.png"
        }
        alt=""
        width={800}
        height={100}
        className={fondClass}
      />
      {isEditing && isMe ? (
        <input
          autoFocus
          type="text"
          className={`relative z-15 w-1/2 border-b-2 bg-transparent text-center text-4xl uppercase outline-none ${isOn ? "border-black text-black" : "border-white text-white"}`}
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
      ) : (
        <span
          className={`relative z-15 text-4xl ${isOn ? "text-black" : "text-white"}`}
        >
          {player.name} {isOn && "(Prêt)"}
        </span>
      )}
      {isMe && (
        <Image
          src={
            isOn
              ? "/assets/pen-to-square-black.png"
              : "/assets/pen-to-square.png"
          }
          alt=""
          width={100}
          height={100}
          className="pointer-events-none absolute right-4 z-0 w-12 select-none"
        />
      )}
    </li>
  );
}

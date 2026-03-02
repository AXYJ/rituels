"use client";

import Image from "next/image";
import { useGame } from "../../context/GameContext";
import { useState } from "react";

export default function Helper() {
  const { rules } = useGame();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-1/2 w-full flex-col items-end justify-end gap-4">
      <div
        className=""
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Image
          src="/pen-to-square-solid-full.svg"
          alt="Modifier les règles"
          width={50}
          height={50}
        />
      </div>
      <div
        className={`grid w-full transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="grid w-full grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              {Object.keys(rules?.symbolRules || {}).map((symbol, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 items-center gap-2"
                >
                  <label htmlFor={symbol}>{symbol}</label>
                  <select
                    name={symbol}
                    id={symbol}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="">--</option>
                    {[3, 2, 1, 0, -1].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {Object.keys(rules?.colorRules || {}).map((color, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 items-center gap-2"
                >
                  <label htmlFor={color}>{color}</label>
                  <select
                    name={color}
                    id={color}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="">--</option>
                    {["Inversion", "Gel", "Répétition", "Neutre"].map(
                      (value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      )
                    )}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

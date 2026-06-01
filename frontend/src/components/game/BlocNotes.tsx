"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useGame } from "../../context/GameContext";
import { normalizeSymbol } from "../../utils/normalizeSymbol";

export default function Helper() {
  const [isEditing, setIsEditing] = useState(false);

  const { rules, players, socket, propositions, setPropositions } = useGame();

  const me = players.find((p) => p.id === socket?.id);

  if (!me) return null;

  return (
    <>
      {isEditing && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsEditing(false)}
        />
      )}

      <div
        className={`pointer-events-none fixed right-0 bottom-0 left-0 flex w-full flex-col justify-end transition-colors duration-300 lg:pointer-events-auto lg:static lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4 lg:w-auto lg:items-center lg:justify-end lg:gap-4 ${isEditing ? "z-40 bg-linear-to-t from-[#191918] via-[#191918]/95 to-transparent" : "z-10"} `}
      >
        <div className="flex w-full flex-col items-end justify-end">
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100) {
                setIsEditing(false);
              }
            }}
            className={`pointer-events-auto grid w-full transition-all duration-300 ease-in-out lg:grid-rows-[1fr] lg:pb-4 ${
              isEditing ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr] pb-0"
            }`}
          >
            <div
              className={`absolute top-0 right-4 z-50 mr-4 ml-auto flex items-center gap-4 ${isEditing ? "-translate-y-[120%]" : "-translate-y-[20vh]"}`}
            >
              <h3>Bloc-notes</h3>
              <Image
                src={`/assets/edit.png`}
                alt="card"
                width={1000}
                height={1000}
                className={`pointer-events-auto h-12 w-12 cursor-pointer object-contain drop-shadow-lg transition-all duration-300 ease-in-out lg:hidden`}
                onClick={() => setIsEditing(!isEditing)}
              />
            </div>

            <div className="overflow-hidden">
              <h3 className="mb-4 hidden w-full text-center lg:block">
                Bloc-notes
              </h3>
              <div className="grid w-full grid-cols-2 gap-8 px-4">
                <div className="flex flex-col gap-2">
                  {Object.keys(rules?.symbolRules || {}).map(
                    (symbol, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2"
                      >
                        <label
                          className="flex w-24 items-center text-xl lg:text-2xl"
                          htmlFor={symbol}
                        >
                          <Image
                            src={`/assets/${normalizeSymbol(symbol)}.png`}
                            alt={symbol}
                            width={500}
                            height={500}
                            className="pointer-events-auto relative z-50 mr-4 ml-auto h-4 w-4 object-contain lg:h-6 lg:w-6"
                          />
                        </label>
                        <select
                          name={symbol}
                          id={symbol}
                          value={propositions.symbolRules[symbol] || ""}
                          onChange={(e) =>
                            setPropositions((prev) => ({
                              ...prev,
                              symbolRules: {
                                ...prev.symbolRules,
                                [symbol]: e.target.value,
                              },
                            }))
                          }
                          className="col-span-2 w-full cursor-pointer rounded-md border border-gray-300 bg-white p-2 text-black"
                        >
                          <option value="">--</option>
                          {[3, 2, 1, 0, -1].map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>
                    )
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {Object.keys(rules?.colorRules || {}).map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2"
                    >
                      <label
                        className={`w-24 text-xl lg:text-2xl`}
                        style={{
                          color: `var(--color-card-${color.toLowerCase()})`,
                        }}
                        htmlFor={color}
                      >
                        {color}
                      </label>
                      <select
                        name={color}
                        id={color}
                        value={propositions.colorRules[color] || ""}
                        onChange={(e) =>
                          setPropositions((prev) => ({
                            ...prev,
                            colorRules: {
                              ...prev.colorRules,
                              [color]: e.target.value,
                            },
                          }))
                        }
                        className="col-span-2 w-full rounded-md border border-gray-300 bg-white p-2 text-black"
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
          </motion.div>
        </div>
      </div>
    </>
  );
}

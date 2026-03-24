"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useGame } from "../../context/GameContext";

export default function Helper() {
  const [isEditing, setIsEditing] = useState(false);

  const { rules, players, socket } = useGame();

  const me = players.find((p) => p.id === socket?.id);

  const [scoreDiffs, setScoreDiffs] = useState<{ id: number; diff: number }[]>(
    []
  );
  const prevScoreRef = useRef(me?.score ?? 0);
  const diffIdRef = useRef(0);

  useEffect(() => {
    if (me && me.score !== prevScoreRef.current) {
      const diff = me.score - prevScoreRef.current;
      prevScoreRef.current = me.score;

      if (diff !== 0) {
        const id = diffIdRef.current++;
        setScoreDiffs((prev) => [...prev, { id, diff }]);

        setTimeout(() => {
          setScoreDiffs((prev) => prev.filter((d) => d.id !== id));
        }, 1500);
      }
    }
  }, [me?.score]);

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
        className={`pointer-events-none fixed right-0 bottom-0 left-0 z-40 flex w-full flex-col justify-end transition-colors duration-300 lg:pointer-events-auto lg:static lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4 lg:w-auto lg:items-center lg:justify-end lg:gap-8 ${isEditing ? "bg-linear-to-t from-[#191918] via-[#191918]/95 to-transparent" : ""} `}
      >
        <div className="pointer-events-auto relative mr-4 mb-4 flex items-center gap-2 self-end lg:mr-0 lg:mb-0 lg:self-center">
          <Image
            src={`/cards/Seed.png`}
            alt="card"
            width={1000}
            height={1000}
            className="z-10 h-16 w-16 object-contain"
          />
          <p className="z-10 rounded-full bg-black/50 px-3 py-1 text-xl font-bold">
            x {me.score}
          </p>

          <AnimatePresence>
            {scoreDiffs.map(({ id, diff }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 10, x: 20 }}
                animate={{ opacity: 1, y: -40, x: 20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`pointer-events-none absolute top-0 left-1/2 z-0 -translate-x-1/2 text-3xl font-bold drop-shadow-md lg:right-0 lg:left-auto ${diff > 0 ? "text-green-500" : "text-red-500"}`}
              >
                {diff > 0 ? "+" : ""}
                {diff}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="pointer-events-auto flex w-full flex-col items-end justify-end">
          <Image
            src={`/assets/edit.png`}
            alt="card"
            width={1000}
            height={1000}
            className="relative z-50 mr-4 mb-2 ml-auto h-12 w-12 cursor-pointer object-contain drop-shadow-lg lg:hidden"
            onClick={() => setIsEditing(!isEditing)}
          />

          <div
            className={`grid w-full transition-[grid-template-rows,padding] duration-300 ease-in-out lg:grid-rows-[1fr] lg:pt-4 lg:pb-6 ${
              isEditing
                ? "grid-rows-[1fr] pt-4 pb-6"
                : "grid-rows-[0fr] pt-0 pb-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="grid w-full grid-cols-2 gap-8 px-4">
                <div className="flex flex-col gap-2">
                  {Object.keys(rules?.symbolRules || {}).map(
                    (symbol, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2"
                      >
                        <label
                          className="w-24 text-xl lg:text-2xl"
                          htmlFor={symbol}
                        >
                          {symbol}
                        </label>
                        <select
                          name={symbol}
                          id={symbol}
                          className="col-span-2 w-full rounded-md border border-gray-300 bg-white p-2 text-black"
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
                        className="w-24 text-xl lg:text-2xl"
                        htmlFor={color}
                      >
                        {color}
                      </label>
                      <select
                        name={color}
                        id={color}
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
          </div>
        </div>
      </div>
    </>
  );
}

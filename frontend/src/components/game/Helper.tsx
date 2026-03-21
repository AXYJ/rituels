"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useGame } from "../../context/GameContext";

export default function Helper() {
  const { rules, players, socket } = useGame();
  
  const me = players.find((p) => p.id === socket?.id);
  
  const [scoreDiffs, setScoreDiffs] = useState<{ id: number, diff: number }[]>([]);
  const prevScoreRef = useRef(me?.score ?? 0);
  const diffIdRef = useRef(0);

  useEffect(() => {
    if (me && me.score !== prevScoreRef.current) {
      const diff = me.score - prevScoreRef.current;
      prevScoreRef.current = me.score;
      
      if (diff !== 0) {
        const id = diffIdRef.current++;
        setScoreDiffs(prev => [...prev, { id, diff }]);
        
        setTimeout(() => {
          setScoreDiffs(prev => prev.filter(d => d.id !== id));
        }, 1500);
      }
    }
  }, [me?.score]);

  if (!me) return null;

  return (
    <div className="col-start-3 col-end-4 row-start-2 row-end-4 flex flex-col items-center justify-end gap-8">
      <div className="flex items-center gap-2 relative">
        <Image
          src={`/cards/Seed.png`}
          alt="card"
          width={1000}
          height={1000}
          className="h-16 w-16 object-contain z-10"
        />
        <p className="text-xl font-bold z-10 bg-black/50 px-2 rounded-full">x {me.score}</p>
        
        <AnimatePresence>
          {scoreDiffs.map(({ id, diff }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 10, x: 20 }}
              animate={{ opacity: 1, y: -40, x: 20 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`absolute top-0 right-0 text-3xl font-bold drop-shadow-md pointer-events-none z-0 ${diff > 0 ? "text-green-500" : "text-red-500"}`}
            >
              {diff > 0 ? "+" : ""}{diff}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex w-full flex-col items-end justify-end gap-4">
        <div
          className={`grid w-full transition-all duration-300 ease-in-out grid-rows-[1fr] opacity-100`}
        >
          <div className="overflow-hidden">
            <div className="grid w-full grid-cols-2 gap-16">
            <div className="flex flex-col gap-2">
              {Object.keys(rules?.symbolRules || {}).map((symbol, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2"
                >
                  <label className="w-24 text-2xl" htmlFor={symbol}>
                    {symbol}
                  </label>
                  <select
                    name={symbol}
                    id={symbol}
                    className="col-span-2 w-full rounded-md border border-gray-300 p-2 bg-white text-black"
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
                  className="flex items-center justify-between gap-2"
                >
                  <label className="w-24 text-2xl" htmlFor={color}>
                    {color}
                  </label>
                  <select
                    name={color}
                    id={color}
                    className="col-span-2 w-full rounded-md border border-gray-300 p-2 bg-white text-black"
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
  );
}

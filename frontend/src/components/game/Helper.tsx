"use client"

import { useGame } from "../../context/GameContext";


export default function Helper() {
    const { rules } = useGame();
    return (
        <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-2">
                {Object.keys(rules?.symbolRules || {}).map((symbol, index) => (
                    <div key={index} className="grid grid-cols-2 items-center gap-2">
                        <label htmlFor={symbol}>{symbol}</label>
                        <select name={symbol} id={symbol} className="w-full border border-gray-300 rounded-md p-2">
                            <option value="">--</option>
                            {[3, 2, 1, 0, -1].map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-2">
                {Object.keys(rules?.colorRules || {}).map((color, index) => (
                    <div key={index} className="grid grid-cols-2 items-center gap-2">
                        <label htmlFor={color}>{color}</label>
                        <select name={color} id={color} className="w-full border border-gray-300 rounded-md p-2">
                            <option value="">--</option>
                            {["Inversion", "Gel", "Répétition", "Neutre"].map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>


        </div>
    )
}
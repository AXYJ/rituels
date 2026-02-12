"use client";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-full bg-blue-500 px-8 py-2 font-bold text-white hover:bg-blue-600"
    >
      {children}
    </button>
  );
}

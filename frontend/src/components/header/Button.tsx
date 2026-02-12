'use client'

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
}

export default function Button({ children, onClick }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8 rounded-full"
        >
            {children}
        </button>
    );
}

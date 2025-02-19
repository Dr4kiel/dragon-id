// src/components/ui/card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ children }) => {
  return <div className="text-gray-700">{children}</div>;
};

// src/components/ui/card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center">
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ children }) => {
  return <div className="text-gray-700 w-full">{children}</div>;
};

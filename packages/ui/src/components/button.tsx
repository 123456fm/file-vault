import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "destructive" | "outline";
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
        variant === "outline" && "border border-gray-300 bg-white hover:bg-gray-50",
        className
      )}
      {...props}
    />
  );
}

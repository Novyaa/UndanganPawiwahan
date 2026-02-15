"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

type Option = {
  value: string;
  label: string;
};

interface CustomRadioGroupProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  className?: string;
}

export function CustomRadioGroup({
  options,
  value,
  onChange,
  name = "custom-radio",
  className,
}: CustomRadioGroupProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        const checked = value === option.value;

        return (
          <div key={option.value} className="flex items-center gap-3">
            <input
              type="radio"
              id={id}
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <label
              htmlFor={id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div
                className={cn(
                  "relative h-5 w-5 rounded-full border-2 flex items-center justify-center border-[#E6CFA9]",
                  "transition-all duration-300 ease-out",
                  'after:content-[""] after:absolute after:h-3 after:w-3 after:rounded-full after:bg-[#D4AF37]',
                  "after:transition-all after:duration-300 after:ease-out",
                  checked
                    ? "after:scale-100 after:opacity-100"
                    : "after:scale-0 after:opacity-0",
                )}
              ></div>

              <span className="text-base font-medium text-amber-100 tracking-wider">
                {option.label}
              </span>
            </label>
          </div>
        );
      })}
    </div>
  );
}

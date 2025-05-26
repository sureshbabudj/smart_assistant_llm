import { cn } from "../utils/classnames";
import React, { useState } from "react";
import type { DropdownItem } from "../types";

export function DropdownMenu({
  items,
  handleSelect,
  children,
}: React.PropsWithChildren<{
  handleSelect: (item: DropdownItem) => void;
  items: DropdownItem[];
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div className="dropdown inline-block relative" onClick={toggle}>
      {children}
      <ul
        className={cn(
          "dropdown-menu absolute right-0 bg-background-light text-foreground-light pt-1 rounded-lg shadow-lg transition-all duration-300 ease-in-out",
          isOpen ? "block" : "hidden"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={item.label}
            className="min-w-40 block border-b border-stroke"
          >
            <button
              className={cn(
                "bg-background-light text-foreground-light hover:bg-highlight hover:text-background  py-2 px-4 block whitespace-no-wrap w-full text-left",
                idx === 0 ? "rounded-t-lg" : "",
                idx === items.length - 1 ? "rounded-b-lg" : ""
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(item);
              }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

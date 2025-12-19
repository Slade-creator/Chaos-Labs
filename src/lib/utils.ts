import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDangerZone(h: number, c: number) {
 return h >= 5 && h <= 10 && c >= 8 && c <= 10;
}
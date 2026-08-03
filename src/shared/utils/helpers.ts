import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Łączy klasy Tailwind z obsługą konfliktów (np. p-2 + p-4 = p-4)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatuje datę do polskiego formatu dd.MM.yyyy
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

// Skraca tekst do podanej długości
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

// Buduje initials z imienia i nazwiska (np. "Jan Kowalski" → "JK")
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

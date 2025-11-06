import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createContext } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MyContext = createContext<any>({});

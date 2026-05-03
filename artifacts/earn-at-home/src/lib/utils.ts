import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupee(amount: number): string {
  return "Rs " + new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// If a custom API URL is configured (e.g. Railway), use it for all API calls
if (import.meta.env.VITE_API_URL) {
  setBaseUrl(import.meta.env.VITE_API_URL)
}

// Set auth token getter for API calls
setAuthTokenGetter(() => {
  return localStorage.getItem("admin_token")
})

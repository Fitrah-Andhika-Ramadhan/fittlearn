"use client"

import { useEffect } from "react"
import { cmsStorage } from "@/lib/cms-storage"

// Component to ensure CMS data is always synced
export function CMSDataSync() {
  useEffect(() => {
    // Initialize CMS data on app load
    cmsStorage.initializeCMSData()

    // Listen for storage changes to sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith("fitlearned_cms_")) {
        // Trigger a page refresh or state update when CMS data changes
        window.dispatchEvent(new CustomEvent("cms-data-changed"))
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return null // This component doesn't render anything
}

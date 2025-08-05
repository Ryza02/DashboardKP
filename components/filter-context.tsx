"use client"
import React, { createContext, useContext, useState } from "react"

type FilterState = {
  site: string | null
  period: string // "harian" | "bulanan" | "all" | dst
}

type FilterContextType = {
  filter: FilterState
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>
  resetFilter: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState<FilterState>({
    site: null,
    period: "harian"
  })

  const resetFilter = () => setFilter({ site: null, period: "harian" })

  return (
    <FilterContext.Provider value={{ filter, setFilter, resetFilter }}>
      {children}
    </FilterContext.Provider>
  )
}

// Custom hook
export function useFilter() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error("useFilter must be used within a FilterProvider")
  return ctx
}

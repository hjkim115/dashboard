'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { AuthContext } from './AuthContext'
import { getCompanyName } from '../utils/firebase'

type CompanyNameContextType = {
  companyName: string | null
  setCompanyName: React.Dispatch<React.SetStateAction<string | null>>
}

export const CompanyNameContext = createContext({} as CompanyNameContextType)

export function CompanyNameContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [companyName, setCompanyName] = useState<string | null>(null)

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  useEffect(() => {
    async function fetchCompanyName(store: string) {
      const data = await getCompanyName(store)
      setCompanyName(data)
    }

    if (store) {
      fetchCompanyName(store)
    }
  }, [store])

  return (
    <CompanyNameContext.Provider
      value={{
        companyName,
        setCompanyName,
      }}
    >
      {children}
    </CompanyNameContext.Provider>
  )
}

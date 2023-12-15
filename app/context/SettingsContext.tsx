'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { AuthContext } from './AuthContext'
import { getSettings } from '../utils/firebase'
import { Settings } from '../utils/types'

type SettingsContextType = {
  settings: Settings | null
  setSettings: React.Dispatch<React.SetStateAction<Settings | null>>
}

export const SettingsContext = createContext({} as SettingsContextType)

export function SettingsContextProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null)

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  useEffect(() => {
    async function fetchSettings(store: string) {
      const data = await getSettings(store)
      setSettings(data)
    }

    if (store) {
      fetchSettings(store)
    }
  }, [store])

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

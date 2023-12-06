'use client'

import { useState, useEffect, createContext, ReactNode } from 'react'
import { auth } from '../utils/firebase'
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'

type AuthContextType = {
  user: User | null | undefined
  signUp: (email: string, password: string, store: string) => Promise<void>
  logIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return unsubscribe
  }, [])

  async function signUp(email: string, password: string, store: string) {
    await createUserWithEmailAndPassword(auth, email, password)

    if (!auth.currentUser) {
      throw Error('Type of current user should be User')
    }

    await updateProfile(auth.currentUser, { displayName: store })
  }

  async function logIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logOut() {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}

'use client'

import { useState, useContext } from 'react'
import authStyles from './styles/auth.module.css'
import { AuthContext } from '../context/AuthContext'

export default function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { logIn } = useContext(AuthContext)

  async function handleLogIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      await logIn(email.trim(), password.trim())
    } catch (error) {
      if (error instanceof Error) {
        setError('Please enter valid email and password!')
      }
    }
  }

  return (
    <div className={authStyles.authContainer}>
      <h1>Log In</h1>
      <form id="logInForm" onSubmit={handleLogIn} className={authStyles.form}>
        <div>
          <p>Email</p>
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <p>Password</p>
          <input
            type="text"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? <p style={{ color: 'red' }}>{error}</p> : null}
      </form>

      <div className={authStyles.forTesting}>
        <h2>For Testing</h2>
        <p>Email: test@email.com</p>
        <p>Password: test1234</p>
      </div>

      <button type="submit" form="logInForm">
        Log In
      </button>
    </div>
  )
}

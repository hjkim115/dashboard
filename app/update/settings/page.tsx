'use client'

import settingsStyles from '../../styles/settings.module.css'
import { useState, useEffect, useContext } from 'react'
import { getCompanyName, updateCompanyName } from '../../utils/firebase'
import LoadingPage from '../../components/LoadingPage'
import { AuthContext } from '@/app/context/AuthContext'

export default function Settings() {
  const [companyName, setCompanyName] = useState<string | null>(null)
  const [newCompanyName, setNewCompanyName] = useState<string | null>(null)

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  const isDisabled = companyName === newCompanyName

  useEffect(() => {
    async function fetchCompanyName() {
      if (typeof store !== 'string') {
        throw Error('Type of store should be string!')
      }
      const data = await getCompanyName(store)
      setCompanyName(data)
    }

    if (store) {
      fetchCompanyName()
    }
  }, [store])

  useEffect(() => {
    if (companyName) {
      setNewCompanyName(companyName)
    }
  }, [companyName])

  async function update() {
    if (typeof store !== 'string') {
      throw Error('Type of store should be string!')
    }

    if (typeof newCompanyName !== 'string') {
      throw Error('Type of newCompanyName should be string!')
    }
    await updateCompanyName(store, newCompanyName)
    setCompanyName(newCompanyName)
  }

  if (!(companyName && newCompanyName)) {
    return <LoadingPage />
  }

  return (
    <div className={settingsStyles.settingsContainer}>
      <h1>Settings</h1>

      <div className={settingsStyles.form}>
        <p>Company Name</p>
        <input
          onChange={(e) => setNewCompanyName(e.target.value.trim())}
          defaultValue={newCompanyName}
          type="text"
          style={!isDisabled ? { color: 'red' } : undefined}
        />
      </div>

      <div className={settingsStyles.update}>
        <button disabled={isDisabled} onClick={update}>
          Update
        </button>
      </div>
    </div>
  )
}

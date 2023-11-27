'use client'

import settingsStyles from '../../styles/settings.module.css'
import { useState, useEffect, useContext } from 'react'
import { getCompanyName, updateCompanyName } from '../../utils/firebase'
import LoadingPage from '../../components/LoadingPage'
import { AuthContext } from '@/app/context/AuthContext'
import { CompanyNameContext } from '@/app/context/CompanyNameContext'

export default function Settings() {
  const [newCompanyName, setNewCompanyName] = useState<string | null>(null)

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  const { companyName, setCompanyName } = useContext(CompanyNameContext)

  let isDisabled
  if (newCompanyName != null) {
    isDisabled = companyName === newCompanyName || newCompanyName?.length <= 0
  }

  useEffect(() => {
    if (companyName) {
      setNewCompanyName(companyName)
    }
  }, [companyName])

  async function update(store: string, newCompanyName: string) {
    await updateCompanyName(store, newCompanyName)
    setCompanyName(await getCompanyName(store))
  }

  if (!store || companyName == null || newCompanyName == null) {
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
        <button
          disabled={isDisabled}
          onClick={() => update(store, newCompanyName)}
        >
          Update
        </button>
      </div>
    </div>
  )
}

'use client'

import formStyles from '../../styles/form.module.css'
import { useState, useEffect, useContext } from 'react'
import { getSettings, updateSettings } from '../../utils/firebase'
import LoadingPage from '../../components/LoadingPage'
import { AuthContext } from '@/app/context/AuthContext'
import { SettingsContext } from '@/app/context/SettingsContext'
import Modal from '@/app/components/Modal'
import EditImageForm from '@/app/components/modalForms/EditImageForm'
import { Settings } from '@/app/utils/types'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'

export default function Settings() {
  const [newCompanyName, setNewCompanyName] = useState('')

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  const router = useRouter()

  const { settings, setSettings } = useContext(SettingsContext)
  const companyName = settings?.name

  useEffect(() => {
    if (companyName) {
      setNewCompanyName(companyName)
    }
  }, [settings])

  const disabled = !newCompanyName || companyName === newCompanyName

  async function handleEdit(
    e: React.FormEvent<HTMLFormElement>,
    store: string,
    settings: Settings
  ) {
    e.preventDefault()

    const newSettings = { ...settings }
    newSettings.name = newCompanyName
    await updateSettings(store, newSettings)
    setSettings(await getSettings(store))
  }

  //Modal, Edit Image
  const [editLogoOpen, setEditLogoOpen] = useState(false)

  if (!(store && settings)) {
    return <LoadingPage />
  }

  return (
    <div className={formStyles.formContainer}>
      <h1>Settings</h1>

      {/* Form */}
      <form
        onSubmit={(e) => handleEdit(e, store, settings)}
        id="editCompanyNameForm"
        className={formStyles.form}
      >
        <p>Company Name</p>
        <input
          onChange={(e) => setNewCompanyName(e.target.value.trim())}
          defaultValue={newCompanyName}
          type="text"
          style={companyName !== newCompanyName ? { color: 'red' } : undefined}
        />
      </form>

      {/* Buttons */}
      <div className={formStyles.buttons}>
        <button onClick={() => setEditLogoOpen(true)}>Edit Image</button>
        <button type="submit" form="editCompanyNameForm" disabled={disabled}>
          Edit
        </button>
      </div>

      {/* Go Back */}
      <button className="goBackButton" onClick={() => router.back()}>
        <FaArrowLeft /> Go Back
      </button>

      {/* Modals, Edit Logo Image */}
      <Modal handleClick={() => setEditLogoOpen(false)} isOpen={editLogoOpen}>
        <EditImageForm
          store={store}
          setOpen={setEditLogoOpen}
          type="settings"
          settings={settings}
          setSettings={setSettings}
        />
      </Modal>
    </div>
  )
}

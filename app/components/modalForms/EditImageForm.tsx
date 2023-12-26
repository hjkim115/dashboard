'use client'

import { useState } from 'react'
import modalFormStyles from '../styles/modalForm.module.css'
import { Menu, Settings } from '@/app/utils/types'
import { typeToExtensions, uploadImage } from '@/app/utils/formUtils'
import {
  getMenu,
  getSettings,
  updateMenu,
  updateSettings,
} from '@/app/utils/firebase'

type EditImageProps = {
  store: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  settings?: Settings
  setSettings?: (value: React.SetStateAction<Settings | null>) => void
  menu?: Menu
  setMenu?: (value: React.SetStateAction<Menu | null>) => void
  type: 'settings' | 'menu'
}

export default function EditImageForm({
  store,
  setOpen,
  settings = {} as Settings,
  setSettings = () => {},
  menu = {} as Menu,
  setMenu = () => {},
  type,
}: EditImageProps) {
  const [image, setImage] = useState<File | null>(null)

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    image: File
  ) {
    e.preventDefault()
    setOpen(false)

    const fileName = `${crypto.randomUUID().replaceAll('-', '')}.${
      typeToExtensions[image.type]
    }`
    await uploadImage(store, fileName, image)

    if (type === 'settings') {
      const newSettings = { ...settings }
      newSettings.logoImageName = fileName
      await updateSettings(store, newSettings)

      setSettings(await getSettings(store))
    } else {
      const newMenu = { ...menu }
      newMenu.imageName = fileName
      await updateMenu(store, menu.id, menu.category, newMenu)

      setMenu(await getMenu(store, menu.category, menu.id))
    }
  }

  return (
    <div className={modalFormStyles.formContainer}>
      {/* Title */}
      <h1>Edit Image</h1>

      {/* Image */}
      <div
        style={{
          backgroundImage: `url('${
            process.env.NEXT_PUBLIC_CLOUD_FRONT_URL
          }/${store}/${
            type === 'menu' ? menu.imageName : settings.logoImageName
          }')`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          width: '80%',
          height: '30vh',
          margin: '0.5rem',
        }}
      />

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e, image as File)} id="editImageForm">
        <p>Image*</p>
        <input
          onChange={(e) => {
            if (e.target.files) {
              setImage(e.target.files[0])
            }
          }}
          type="file"
          accept=".jpg, .jpeg, .png"
        />
      </form>

      {/* Buttons */}
      <div className={modalFormStyles.buttons}>
        <button onClick={() => setOpen(false)}>Close</button>
        <button type="submit" form="editImageForm" disabled={!image}>
          Edit
        </button>
      </div>
    </div>
  )
}

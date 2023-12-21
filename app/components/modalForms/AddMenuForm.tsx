'use client'

import { Category, Menu } from '@/app/utils/types'
import { useState } from 'react'
import modalFormStyles from '../styles/modalForm.module.css'
import {
  menuExists,
  idPattern,
  isPriceValid,
  typeToExtensions,
} from '@/app/utils/formUtils'
import { server } from '../../utils/config'
import { postMenu, getAllMenus } from '@/app/utils/firebase'

type AddMenuProps = {
  store: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  menus: Menu[]
  setMenus: (value: React.SetStateAction<Menu[] | null>) => void
  categories: Category[]
}

export default function AddMenuForm({
  store,
  setOpen,
  menus,
  setMenus,
  categories,
}: AddMenuProps) {
  const [id, setId] = useState('')
  const [category, setCategory] = useState('')
  const [koreanName, setKoreanName] = useState('')
  const [englishName, setEnglishName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const disabled =
    !id ||
    !category ||
    !koreanName ||
    !englishName ||
    !price ||
    image == null ||
    !isPriceValid(price) ||
    menuExists(id, category, menus) ||
    !idPattern.test(id)

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    image: File
  ) {
    e.preventDefault()
    setOpen(false)

    //Get Presigned Upload url
    const uploadUrlRes = await fetch(
      `${server}/api/uploadUrl?fileName=${category}-${id}.${
        typeToExtensions[image.type]
      }&store=${store}`
    )
    const uploadUrl = await uploadUrlRes.json()

    //Upload Image
    await fetch(uploadUrl, {
      method: 'PUT',
      body: image,
      headers: {
        'Content-Type': image?.type,
        'Content-Length': image?.size.toString(),
      },
    })

    //Add Menu
    const menu: Menu = {
      id: id,
      category: category,
      koreanName: koreanName,
      englishName: englishName,
      price: Number(price),
      description: description,
      imageName: `${category}-${id}.${typeToExtensions[image.type]}`,
    }

    await postMenu(store, menu)

    const newMenus = await getAllMenus(store)
    setMenus(newMenus)
  }

  return (
    <div className={modalFormStyles.formContainer}>
      {/* Title */}
      <h1>Add Menu</h1>

      {/* Form */}
      <form id="addMenuForm" onSubmit={(e) => handleSubmit(e, image as File)}>
        <p>ID*</p>
        <input
          onChange={(e) => setId(e.target.value.trim())}
          type="text"
          placeholder="ID"
        />
        <p>Category*</p>
        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category!</option>
          {categories.map((category) => (
            <option value={category.id}>{category.englishName}</option>
          ))}
        </select>
        <p>English Name*</p>
        <input
          onChange={(e) => setEnglishName(e.target.value.trim())}
          type="text"
          placeholder="English Name"
        />
        <p>Korean Name*</p>
        <input
          onChange={(e) => setKoreanName(e.target.value.trim())}
          type="text"
          placeholder="Korean Name"
        />
        <p>Price*</p>
        <input
          onChange={(e) => setPrice(e.target.value.trim())}
          type="text"
          placeholder="Price"
        />
        <p>Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value.trim())}
          rows={3}
          placeholder="Description"
        />
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

      {/* Message */}
      {menuExists(id, category, menus) ? (
        <p className={modalFormStyles.message}>
          Menu with category {category}, id {id} already exists!
        </p>
      ) : null}

      {id.length > 0 && !idPattern.test(id) ? (
        <p className={modalFormStyles.message}>
          id should be alphanumeric{'('}a-z, A-Z, 0-9{')'}!
        </p>
      ) : null}

      {price.length > 0 && !isPriceValid(price) ? (
        <p className={modalFormStyles.message}>
          Price should be a number with a maximum of 2 decimal places!
        </p>
      ) : null}

      {/* Buttons */}
      <div className={modalFormStyles.buttons}>
        <button onClick={() => setOpen(false)}>Close</button>
        <button type="submit" form="addMenuForm" disabled={disabled}>
          Add
        </button>
      </div>
    </div>
  )
}

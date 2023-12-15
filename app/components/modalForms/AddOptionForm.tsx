'use client'

import { isPriceValid, optionExists } from '@/app/utils/formUtils'
import modalFormStyles from '../styles/modalForm.module.css'
import { useState } from 'react'
import { Options, Option } from '@/app/utils/types'
import { postOption, getOptions } from '@/app/utils/firebase'

type AddOptionProps = {
  store: string
  id: string
  category: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  options: Options
  setOptions: (value: React.SetStateAction<Options | null>) => void
  optionCategory: string
}

export default function AddOptionForm({
  store,
  id,
  category,
  setOpen,
  options,
  setOptions,
  optionCategory,
}: AddOptionProps) {
  const [optionId, setOptionId] = useState('')
  const [englishName, setEnglishName] = useState('')
  const [koreanName, setKoreanName] = useState('')
  const [price, setPrice] = useState('')

  const disabled =
    !optionId ||
    !optionCategory ||
    !englishName ||
    !koreanName ||
    !price ||
    !isPriceValid(price) ||
    optionExists(optionCategory, optionId, options)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setOpen(false)

    const option: Option = {
      id: optionId,
      category: optionCategory,
      menuId: id,
      menuCategory: category,
      englishName: englishName,
      koreanName: koreanName,
      price: Number(price),
    }
    await postOption(store, option)

    const newOptions = await getOptions(store, category, id)
    setOptions(newOptions)
  }

  return (
    <div className={modalFormStyles.formContainer}>
      {/* Title */}
      <h1>Add {optionCategory}</h1>
      {/* Form */}
      <form id="addOptionForm" onSubmit={(e) => handleSubmit(e)}>
        <p>ID*</p>
        <input
          placeholder="ID"
          onChange={(e) => setOptionId(e.target.value.trim())}
        />
        <p>English Name*</p>
        <input
          placeholder="English Name"
          onChange={(e) => setEnglishName(e.target.value.trim())}
        />
        <p>Korean Name*</p>
        <input
          placeholder="Korean Name"
          onChange={(e) => setKoreanName(e.target.value.trim())}
        />
        <p>Price*</p>
        <input
          placeholder="Price"
          onChange={(e) => setPrice(e.target.value.trim())}
        />
      </form>
      {/* Message */}
      {optionExists(optionCategory, optionId, options) ? (
        <p className={modalFormStyles.message}>
          Option with category {optionCategory}, id {optionId} already exists!
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
        <button type="submit" form="addOptionForm" disabled={disabled}>
          Add
        </button>
      </div>
    </div>
  )
}

'use client'

import { useContext, useEffect, useState } from 'react'
import detailsStyles from '../../../styles/details.module.css'
import { Menu, Option, Options } from '@/app/utils/types'
import { AuthContext } from '@/app/context/AuthContext'
import { getMenu, getOptions } from '@/app/utils/firebase'
import { useParams, useSearchParams } from 'next/navigation'
import LoadingPage from '@/app/components/LoadingPage'
import { FaPlus, FaAngleDown, FaAngleUp, FaPencilAlt } from 'react-icons/fa'
import Modal from '@/app/components/Modal'

export default function menu() {
  const [menu, setMenu] = useState<Menu | null>(null)
  const [options, setOptions] = useState<Options | null>(null)
  const [optionsOpens, setOptionsOpens] = useState<boolean[] | null>(null)

  //Add Category
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)

  //Edit Category
  const [editCategoryOpen, setEditCategoryOpen] = useState(false)

  //Add Option
  const [addOptionOpen, setAddOptionOpen] = useState(false)

  //Edit Option
  const [editOptionOpen, setEditOptionOpen] = useState(false)

  const { id } = useParams()
  const category = useSearchParams().get('category')

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  useEffect(() => {
    async function fetchMenu(store: string, category: string, id: string) {
      const data = await getMenu(store, category, id)
      setMenu(data)
    }

    async function fetchOptions(store: string, category: string, id: string) {
      const data = await getOptions(store, category, id)
      setOptions(data)
    }

    if (store && category && id) {
      if (typeof id === 'string') {
        fetchMenu(store, category, id)
        fetchOptions(store, category, id)
      }
    }
  }, [store && category && id])

  useEffect(() => {
    if (options) {
      const opens = []
      for (let i = 0; i < Object.keys(options).length; i++) {
        opens.push(false)
      }

      setOptionsOpens(opens)
    }
  }, [options])

  if (!(menu && options && optionsOpens)) {
    return <LoadingPage />
  }

  return (
    <div className={detailsStyles.detailsContainer}>
      <h1>Edit Menu</h1>

      <div className={detailsStyles.form}>
        <p>ID</p>
        <input />
        <p>Category</p>
        <select></select>
        <p>English Name</p>
        <input />
        <p>Korean Name</p>
        <input />
        <p>Price</p>
        <input />
        <p>Description</p>
        <textarea rows={3} placeholder="Description" />
        <p>Image Name</p>
        <input />
      </div>

      <div className={detailsStyles.update}>
        <button>Update</button>
      </div>

      <h2 className={detailsStyles.options}>Options</h2>

      <div className={detailsStyles.categoriesLabel}>
        <p>Categories</p>
        <FaPlus onClick={() => setAddCategoryOpen(true)} />
      </div>

      {Object.keys(options).map((key, i) => (
        <div className={detailsStyles.optionsContainer}>
          <div className={detailsStyles.categoryLabel}>
            <p>{key}</p>
            <div className={detailsStyles.optionsButtons}>
              <FaPencilAlt
                onClick={() => setEditCategoryOpen(true)}
                className={detailsStyles.editCategory}
              />
              <FaPlus
                onClick={() => setAddOptionOpen(true)}
                className={detailsStyles.addOption}
              />
              {optionsOpens[i] === false ? (
                <FaAngleDown
                  onClick={() => {
                    const newOptionsOpens = [...optionsOpens]
                    newOptionsOpens[i] = true
                    setOptionsOpens(newOptionsOpens)
                  }}
                />
              ) : (
                <FaAngleUp
                  onClick={() => {
                    const newOptionsOpens = [...optionsOpens]
                    newOptionsOpens[i] = false
                    setOptionsOpens(newOptionsOpens)
                  }}
                />
              )}
            </div>
          </div>

          {optionsOpens[i] === true
            ? options[key].map((option: Option) => (
                <div className={detailsStyles.option}>
                  <p>{option.englishName}</p>
                  <FaPencilAlt onClick={() => setEditOptionOpen(true)} />
                </div>
              ))
            : null}
        </div>
      ))}

      {addCategoryOpen ? (
        <Modal handleClick={() => setAddCategoryOpen(false)}>
          <div>
            <h2>Add Category</h2>
          </div>
        </Modal>
      ) : null}

      {editCategoryOpen ? (
        <Modal handleClick={() => setEditCategoryOpen(false)}>
          <div>
            <h2>Edit Category</h2>
          </div>
        </Modal>
      ) : null}

      {addOptionOpen ? (
        <Modal handleClick={() => setAddOptionOpen(false)}>
          <div>
            <h2>Add Option</h2>
          </div>
        </Modal>
      ) : null}

      {editOptionOpen ? (
        <Modal handleClick={() => setEditOptionOpen(false)}>
          <div>
            <h2>Edit Option</h2>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

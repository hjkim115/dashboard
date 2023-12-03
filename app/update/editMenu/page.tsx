'use client'

import { useContext, useEffect, useState } from 'react'
import detailsStyles from '../../styles/details.module.css'
import formStyles from '../../styles/form.module.css'
import { Category, Menu, Option, Options } from '@/app/utils/types'
import { AuthContext } from '@/app/context/AuthContext'
import {
  deleteMenu,
  deleteOption,
  deleteOptionCategory,
  getAllCategories,
  getAllMenus,
  getMenu,
  getOptions,
  postOption,
  updateMenu,
  updateOption,
  updateOptionCategory,
} from '@/app/utils/firebase'
import { useSearchParams, useRouter } from 'next/navigation'
import LoadingPage from '@/app/components/LoadingPage'
import { FaPlus, FaAngleDown, FaAngleUp, FaPencilAlt } from 'react-icons/fa'
import Modal from '@/app/components/Modal'
import Menus from '../menus/page'

export default function menu() {
  const [menus, setMenus] = useState<Menu[] | null>(null)
  const [menu, setMenu] = useState<Menu | null>(null)
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [options, setOptions] = useState<Options | null>(null)
  const [optionsOpens, setOptionsOpens] = useState<boolean[] | null>(null)

  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const id = searchParams.get('id')

  const router = useRouter()

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  useEffect(() => {
    async function fetchCategories(store: string) {
      const data = await getAllCategories(store)
      setCategories(data)
    }

    async function fetchMenu(store: string, category: string, id: string) {
      const data = await getMenu(store, category, id)
      setMenu(data)
    }

    async function fetchMenus(store: string) {
      const data = await getAllMenus(store)
      setMenus(data)
    }

    async function fetchOptions(store: string, category: string, id: string) {
      const data = await getOptions(store, category, id)
      setOptions(data)
    }

    if (store && category && id) {
      if (typeof id === 'string') {
        fetchCategories(store)
        fetchMenu(store, category, id)
        fetchMenus(store)
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

  useEffect(() => {
    if (menu) {
      setNewId(menu.id)
      setNewCategory(menu.category)
      setNewEnglishName(menu.englishName)
      setNewKoreanName(menu.koreanName)
      setNewPrice(menu.price.toString())
      if (menu.description) {
        setNewDescription(menu.description)
      }
    }
  }, [menu])

  const idPattern = /^[a-zA-Z0-9]+$/

  //Edit Menu
  const [newId, setNewId] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newEnglishName, setNewEnglishName] = useState('')
  const [newKoreanName, setNewKoreanName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newDescription, setNewDescription] = useState('')
  let editMenuDisabled
  if (menu && menus) {
    editMenuDisabled =
      !newId ||
      !newCategory ||
      !newEnglishName ||
      !newKoreanName ||
      !newPrice ||
      !newDescription ||
      !isPriceValid(newPrice) ||
      !idPattern.test(newId) ||
      menuEquals(menu) ||
      menuExists(menus, newId, newCategory)
  }

  async function handleMenuEdit(
    e: React.FormEvent<HTMLFormElement>,
    store: string,
    id: string,
    category: string,
    menu: Menu
  ) {
    e.preventDefault()

    const values: { [id: string]: any } = {}

    if (menu.id !== newId) {
      values['id'] = newId
    }
    if (menu.category !== newCategory) {
      values['category'] = newCategory
    }
    if (menu.englishName !== newEnglishName) {
      values['englishName'] = newEnglishName
    }
    if (menu.koreanName !== newKoreanName) {
      values['koreanName'] = newKoreanName
    }
    if (menu.price.toString() !== newPrice) {
      values['price'] = Number(newPrice)
    }
    if (menu.description !== newDescription) {
      values['description'] = newDescription
    }

    await updateMenu(store, id, category, values)

    if (newId !== id || newCategory !== category) {
      router.push('/update/menus')
    } else {
      const newMenu = await getMenu(store, category, id)
      setMenu(newMenu)
    }
  }

  async function handleMenuDelete(store: string, id: string, category: string) {
    if (!confirm('Are you sure you want to delete this Menu?')) {
      return
    }

    await deleteMenu(store, id, category)
    router.push('/update/menus')
  }

  function menuEquals(menu: Menu) {
    if (
      menu.id === newId &&
      menu.category === newCategory &&
      menu.englishName === newEnglishName &&
      menu.koreanName === newKoreanName &&
      menu.price.toString() === newPrice &&
      menu.description === newDescription
    ) {
      return true
    }

    return false
  }

  function menuExists(menus: Menu[], id: string, category: string) {
    for (const menu of menus) {
      if (menu.id === id && menu.category === category) {
        return true
      }
    }

    return false
  }

  //Add Category
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [addCategory, setaddCategory] = useState('')
  let addOptionCategoryDisabled

  if (options) {
    addOptionCategoryDisabled =
      addCategory === '' || Object.keys(options).includes(addCategory)
  }

  function handleAddCategoryClose() {
    setAddCategoryOpen(false)
    setaddCategory('')
  }

  function addOptionCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newOptions: Options = { ...options }
    newOptions[addCategory] = []
    setOptions(newOptions)
    handleAddCategoryClose()
  }

  //Edit Category
  const [editCategoryOpen, setEditCategoryOpen] = useState(false)
  const [editCategory, setEditCategory] = useState('')
  const [newOptionCategory, setNewOptionCategory] = useState('')

  let editCategoryDisabled

  if (options) {
    editCategoryDisabled =
      newOptionCategory === '' ||
      editCategory === newOptionCategory ||
      Object.keys(options).includes(newOptionCategory)
  }

  function handleEditCategoryOpen(selectedOptionCategory: string) {
    setEditCategory(selectedOptionCategory)
    setNewOptionCategory(selectedOptionCategory)
    setEditCategoryOpen(true)
  }

  async function handleEditOptionCategory(
    e: React.FormEvent<HTMLFormElement>,
    options: Options,
    store: string,
    category: string,
    id: string
  ) {
    e.preventDefault()

    if (options[editCategory].length <= 0) {
      const newOptions = { ...options }
      delete newOptions[editCategory]
      newOptions[newOptionCategory] = []

      setOptions(newOptions)
      return
    } else {
      await updateOptionCategory(
        store,
        category,
        id,
        editCategory,
        newOptionCategory
      )

      const newOptions = await getOptions(store, category, id)
      setOptions(newOptions)
    }

    setAddCategoryOpen(false)
  }

  async function handleDeleteOptionCategory(
    options: Options,
    store: string,
    category: string,
    id: string
  ) {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }
    if (options[editCategory].length <= 0) {
      const newOptions = { ...options }
      delete newOptions[editCategory]

      setOptions(newOptions)
    } else {
      await deleteOptionCategory(store, category, id, editCategory)

      const newOptions = await getOptions(store, category, id)
      setOptions(newOptions)
    }

    setEditCategoryOpen(false)
  }

  //Add Option
  const [addOptionOpen, setAddOptionOpen] = useState(false)
  const [optionCategory, setOptionCategory] = useState('')
  const [optionId, setOptionId] = useState('')
  const [englishName, setEnglishName] = useState('')
  const [koreanName, setKoreanName] = useState('')
  const [price, setPrice] = useState('')

  function handleAddOptionOpen(selectedOptionCategory: string) {
    setOptionCategory(selectedOptionCategory)
    setAddOptionOpen(true)
  }

  function handleAddOptionClose() {
    setAddOptionOpen(false)
    setOptionCategory('')
    setOptionId('')
    setEnglishName('')
    setKoreanName('')
    setPrice('')
  }

  async function addOption(
    e: React.FormEvent<HTMLFormElement>,
    store: string,
    id: string,
    category: string
  ) {
    e.preventDefault()

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
    handleAddOptionClose()
  }

  let addOptionDisabled

  if (options) {
    addOptionDisabled =
      optionId === '' ||
      optionCategory === '' ||
      englishName === '' ||
      koreanName === '' ||
      price === '' ||
      !isPriceValid(price) ||
      optionExists(options, optionCategory, optionId)
  }

  //Edit Option
  const [editOptionOpen, setEditOptionOpen] = useState(false)
  const [editOption, setEditOption] = useState({} as Option)
  const [newOptionId, setNewOptionId] = useState('')
  const [newOptionEnglishName, setNewOptionEnglishName] = useState('')
  const [newOptionKoreanName, setNewOptionKoreanName] = useState('')
  const [newOptionPrice, setNewOptionPrice] = useState('')

  function handleEditOptionOpen(option: Option) {
    setEditOption(option)
    setNewOptionId(option.id)
    setNewOptionEnglishName(option.englishName)
    setNewOptionKoreanName(option.koreanName)
    setNewOptionPrice(option.price.toString())
    setEditOptionOpen(true)
  }

  async function handleOptionEdit(
    e: React.FormEvent<HTMLFormElement>,
    store: string,
    editOption: Option,
    category: string,
    id: string
  ) {
    e.preventDefault()
    const newOption: Option = {
      id: newOptionId,
      category: editOption.category,
      menuId: editOption.menuId,
      menuCategory: editOption.menuCategory,
      englishName: newOptionEnglishName,
      koreanName: newOptionKoreanName,
      price: Number(newOptionPrice),
    }
    await updateOption(store, editOption.category, editOption.id, newOption)

    const newOptions = await getOptions(store, category, id)
    setOptions(newOptions)
    setEditOptionOpen(false)
  }

  async function handleOptionDelete(
    store: string,
    category: string,
    id: string,
    editOption: Option
  ) {
    if (!confirm('Are you sure you want to delete this option?')) {
      return
    }
    await deleteOption(store, editOption.category, editOption.id)

    const newOptions = await getOptions(store, category, id)
    setOptions(newOptions)
    setEditOptionOpen(false)
  }

  let editOptionDisabled

  if (options && editOption && editOptionOpen) {
    editOptionDisabled =
      newOptionId === '' ||
      newOptionEnglishName === '' ||
      newOptionKoreanName === '' ||
      newOptionPrice === '' ||
      !isPriceValid(newOptionPrice) ||
      optionExists(options, editOption.category, newOptionId) ||
      optionEquals(editOption)
  }

  function optionEquals(editOption: Option) {
    if (
      newOptionId === editOption.id &&
      newOptionEnglishName === editOption.englishName &&
      newOptionKoreanName === editOption.koreanName &&
      newOptionPrice === editOption.price.toString()
    ) {
      return true
    }

    return false
  }

  function isPriceValid(price: string) {
    const pricePattern = /^[0-9.]+$/

    if (!pricePattern.test(price)) {
      return false
    }

    if (price.includes('.')) {
      let pointCount = 0
      for (let i = 0; i < price.length; i++) {
        if (price[i] === '.') {
          pointCount++
        }
      }

      if (pointCount > 1) {
        return false
      }

      const priceSplit = price.split('.')

      const integer = priceSplit[0]
      const decimal = priceSplit[1]

      if (integer.length <= 0) {
        return false
      }

      if (decimal.length > 2 || decimal.length <= 0) {
        return false
      }
    }

    return true
  }

  function optionExists(
    options: Options,
    optionCategory: string,
    optionId: string
  ) {
    for (const option of options[optionCategory]) {
      if (option.id === optionId) {
        return true
      }
    }

    return false
  }

  function menuCategoryValid(categories: Category[], menuCategory: string) {
    for (const category of categories) {
      if (menuCategory === category.id) {
        return true
      }
    }

    return false
  }

  if (
    !(
      categories &&
      menu &&
      menus &&
      options &&
      optionsOpens &&
      store &&
      id &&
      category
    )
  ) {
    return <LoadingPage />
  }

  return (
    <div className={detailsStyles.detailsContainer}>
      <h1>Edit Menu</h1>

      {!menuCategoryValid(categories, menu.category) ? (
        <p className={formStyles.message}>Current category has been deleted!</p>
      ) : null}

      <div className={detailsStyles.form}>
        <form
          onSubmit={(e) => handleMenuEdit(e, store, id, category, menu)}
          id="editMenuForm"
          className={formStyles.form}
        >
          <p>ID*</p>
          <input
            defaultValue={newId}
            onChange={(e) => setNewId(e.target.value.trim())}
          />
          <p>Category*</p>
          <select
            defaultValue={newCategory}
            onChange={(e) => setNewCategory(e.target.value.trim())}
          >
            {categories.map((category) => (
              <option value={category.id}>{category.englishName}</option>
            ))}
          </select>
          <p>English Name*</p>
          <input
            defaultValue={newEnglishName}
            onChange={(e) => setNewEnglishName(e.target.value.trim())}
          />
          <p>Korean Name*</p>
          <input
            defaultValue={newKoreanName}
            onChange={(e) => setNewKoreanName(e.target.value.trim())}
          />
          <p>Price*</p>
          <input
            defaultValue={newPrice}
            onChange={(e) => setNewPrice(e.target.value.trim())}
          />
          <p>Description</p>
          <textarea
            defaultValue={newDescription}
            onChange={(e) => setNewDescription(e.target.value.trim())}
            rows={3}
          />

          {(menu.id !== newId || menu.category !== newCategory) &&
          menuExists(menus, newId, newCategory) ? (
            <p className={formStyles.message}>
              Menu with category {newCategory}, id {newId} already exists!
            </p>
          ) : null}
          {newId.length > 0 && !idPattern.test(newId) ? (
            <p className={formStyles.message}>
              id should be alphanumeric{'('}a-z, A-Z, 0-9{')'}!
            </p>
          ) : null}
          {newPrice.length > 0 && !isPriceValid(newPrice) ? (
            <p className={formStyles.message}>
              Price should be a number with a maximum of 2 decimal places!
            </p>
          ) : null}
        </form>
      </div>

      <div className={detailsStyles.buttons}>
        <div className={formStyles.buttons}>
          <button onClick={() => handleMenuDelete(store, id, category)}>
            Delete
          </button>
          <button type="submit" form="editMenuForm" disabled={editMenuDisabled}>
            Update
          </button>
        </div>
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
                onClick={() => handleEditCategoryOpen(key)}
                className={detailsStyles.editCategory}
              />
              <FaPlus
                onClick={() => handleAddOptionOpen(key)}
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
                  <FaPencilAlt onClick={() => handleEditOptionOpen(option)} />
                </div>
              ))
            : null}
        </div>
      ))}

      {addCategoryOpen ? (
        <Modal handleClick={() => setAddCategoryOpen(false)}>
          <form
            onSubmit={(e) => addOptionCategory(e)}
            id="addOptionCategory"
            className={formStyles.form}
          >
            <h1>Add Category</h1>
            <p>Category*</p>
            <input
              onChange={(e) => setaddCategory(e.target.value.trim())}
              type="text"
              placeholder="Category"
            />

            {Object.keys(options).includes(addCategory) ? (
              <p className={formStyles.message}>
                Category {addCategory} already exists!
              </p>
            ) : null}
          </form>
          <div className={formStyles.buttons}>
            <button onClick={() => handleAddCategoryClose()}>Close</button>
            <button
              type="submit"
              form="addOptionCategory"
              disabled={addOptionCategoryDisabled}
            >
              Add
            </button>
          </div>
        </Modal>
      ) : null}

      {editCategoryOpen ? (
        <Modal handleClick={() => setEditCategoryOpen(false)}>
          <form
            onSubmit={(e) =>
              handleEditOptionCategory(e, options, store, category, id)
            }
            id="editOptionCategory"
            className={formStyles.form}
          >
            <h1>Edit Category</h1>
            <p>Category*</p>
            <input
              onChange={(e) => setNewOptionCategory(e.target.value.trim())}
              defaultValue={newOptionCategory}
              type="text"
            />

            {editCategory !== newOptionCategory &&
            Object.keys(options).includes(newOptionCategory) ? (
              <p className={formStyles.message}>
                Category {newOptionCategory} already exists!
              </p>
            ) : null}
          </form>
          <div className={formStyles.buttons}>
            <button onClick={() => setEditCategoryOpen(false)}>Close</button>
            <button
              onClick={() =>
                handleDeleteOptionCategory(options, store, category, id)
              }
            >
              Delete
            </button>
            <button
              type="submit"
              form="editOptionCategory"
              disabled={editCategoryDisabled}
            >
              Edit
            </button>
          </div>
        </Modal>
      ) : null}

      {addOptionOpen ? (
        <Modal handleClick={() => setAddOptionOpen(false)}>
          <form
            id="addOptionForm"
            onSubmit={(e) => addOption(e, store, id as string, category)}
            className={formStyles.form}
          >
            <h1>Add {optionCategory}</h1>
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
            {optionExists(options, optionCategory, optionId) ? (
              <p className={formStyles.message}>
                Option with category {optionCategory}, id {optionId} already
                exists!
              </p>
            ) : null}

            {price.length > 0 && !isPriceValid(price) ? (
              <p className={formStyles.message}>
                Price should be a number with a maximum of 2 decimal places!
              </p>
            ) : null}
          </form>
          <div className={formStyles.buttons}>
            <button onClick={handleAddOptionClose}>Close</button>
            <button
              type="submit"
              form="addOptionForm"
              disabled={addOptionDisabled}
            >
              Add
            </button>
          </div>
        </Modal>
      ) : null}

      {editOptionOpen ? (
        <Modal handleClick={() => setEditOptionOpen(false)}>
          <form
            onSubmit={(e) =>
              handleOptionEdit(e, store, editOption as Option, category, id)
            }
            id="editOptionForm"
            className={formStyles.form}
          >
            <h1>Edit Option</h1>
            <p>ID*</p>
            <input
              defaultValue={newOptionId}
              onChange={(e) => setNewOptionId(e.target.value.trim())}
            />
            <p>English Name*</p>
            <input
              defaultValue={newOptionEnglishName}
              onChange={(e) => setNewOptionEnglishName(e.target.value.trim())}
            />
            <p>Korean Name*</p>
            <input
              defaultValue={newOptionKoreanName}
              onChange={(e) => setNewOptionKoreanName(e.target.value.trim())}
            />
            <p>Price*</p>
            <input
              defaultValue={newOptionPrice}
              onChange={(e) => setNewOptionPrice(e.target.value.trim())}
            />
            {newOptionPrice.length > 0 && !isPriceValid(newOptionPrice) ? (
              <p className={formStyles.message}>
                Price should be a number with a maximum of 2 decimal places!
              </p>
            ) : null}

            {editOption.id !== newOptionId &&
            optionExists(options, editOption.category, newOptionId) ? (
              <p className={formStyles.message}>
                {editOption.category} with id {newOptionId} already exists!
              </p>
            ) : null}
          </form>
          <div className={formStyles.buttons}>
            <button onClick={() => setEditOptionOpen(false)}>Close</button>
            <button
              onClick={() =>
                handleOptionDelete(store, category, id, editOption as Option)
              }
            >
              Delete
            </button>
            <button
              type="submit"
              form="editOptionForm"
              disabled={editOptionDisabled}
            >
              Edit
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

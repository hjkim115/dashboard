'use client'

import { useState, useEffect, useContext } from 'react'
import { Category } from '../../utils/types'
import {
  getAllCategories,
  postCategory,
  updateCategory,
  deleteCategory,
} from '../../utils/firebase'
import Label from '../../components/Label'
import listStyles from '../../styles/list.module.css'
import categoriesStyles from '../../styles/categories.module.css'
import modalStyles from '../../styles/modal.module.css'
import { FaPencilAlt, FaPlus } from 'react-icons/fa'
import AddItem from '../../components/AddItem'
import Modal from '../../components/Modal'
import LoadingPage from '../../components/LoadingPage'
import { AuthContext } from '@/app/context/AuthContext'

export default function Categories() {
  const [categories, setCategories] = useState<Category[] | null>(null)
  //Edit
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [newId, setNewId] = useState<string>('')
  const [newEnglishName, setNewEnglishName] = useState<string>('')
  const [newKoreanName, setNewKoreanName] = useState<string>('')

  //Add
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [id, setId] = useState('')
  const [englishName, setEnglishName] = useState('')
  const [koreanName, setKoreanName] = useState('')

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  useEffect(() => {
    async function fetchCategories() {
      if (typeof store !== 'string') {
        throw Error('Type of store should be string!')
      }
      const data = await getAllCategories(store)
      setCategories(data)
    }

    if (store) {
      fetchCategories()
    }
  }, [store])

  // Disabled
  const editDisabled =
    (editCategory?.id === newId &&
      editCategory?.englishName === newEnglishName &&
      editCategory?.koreanName === newKoreanName) ||
    newId === '' ||
    newEnglishName === '' ||
    newKoreanName === '' ||
    idExists(newId)

  const addDisabled =
    id === '' || englishName === '' || koreanName === '' || idExists(id)

  //Modal Scroll
  if (editModalOpen || addModalOpen) {
    document.body.classList.add(modalStyles.activeModal)
  } else {
    document.body.classList.remove(modalStyles.activeModal)
  }

  function idExists(id: string) {
    if (categories) {
      for (const category of categories) {
        if (category.id === id) {
          return true
        }
      }
      return false
    }
  }

  function handleEdit(category: Category) {
    setEditCategory(category)
    setNewId(category.id)
    setNewEnglishName(category.englishName)
    setNewKoreanName(category.koreanName)
    setEditModalOpen(true)
  }

  function checkSort(a: Category, b: Category) {
    if (a.id > b.id) {
      return 1
    }
    if (a.id < b.id) {
      return -1
    }
    return 0
  }

  function handleAddModalClose() {
    setAddModalOpen(false)
    setId('')
    setEnglishName('')
    setKoreanName('')
  }

  async function edit() {
    if (!categories) {
      throw Error('categories is not set!')
    }
    if (!editCategory) {
      throw Error('editCategory is not set!')
    }
    if (!newId) {
      throw Error('newId is not set!')
    }
    if (!newEnglishName) {
      throw Error('newEnglishName is not set!')
    }
    if (!newKoreanName) {
      throw Error('newKoreanName is not set!')
    }
    if (typeof store !== 'string') {
      throw Error('Type of store should be string!')
    }

    setEditModalOpen(false)

    const newCategory: Category = {
      id: newId,
      englishName: newEnglishName,
      koreanName: newKoreanName,
    }

    await updateCategory(store, editCategory.id, newCategory)

    const newCategories = [...categories]

    for (const category of newCategories) {
      if (category.id === editCategory.id) {
        category.id = newCategory.id
        category.englishName = newCategory.englishName
        category.koreanName = newCategory.koreanName
      }
    }
    newCategories.sort(checkSort)
    setCategories(newCategories)
  }

  async function handleDelete() {
    if (!categories) {
      throw Error('categories is not set!')
    }
    if (!editCategory) {
      throw Error('editCategory is not set!')
    }
    if (typeof store !== 'string') {
      throw Error('Type of store should be string!')
    }

    if (confirm('Are you sure you want to delete this category?')) {
      setEditModalOpen(false)
      await deleteCategory(store, editCategory.id)
      const newCategories = []
      for (const category of categories) {
        if (category.id === editCategory.id) {
          continue
        }
        newCategories.push(category)
      }
      setCategories(newCategories)
    }
  }

  async function add() {
    if (!categories) {
      throw Error('categories is not set!')
    }
    if (typeof store !== 'string') {
      throw Error('Type of store should be string!')
    }

    const category: Category = {
      id: id,
      englishName: englishName,
      koreanName: koreanName,
    }
    await postCategory(store, category)
    handleAddModalClose()
    const newCategories = [...categories]
    newCategories.push(category)
    newCategories.sort(checkSort)
    setCategories(newCategories)
  }

  if (!categories) {
    return <LoadingPage />
  }

  return (
    <div className={categoriesStyles.categoriesContainer}>
      <h1>Categories</h1>
      <Label />

      {categories.map((category) => (
        <div className={listStyles.item}>
          <p className={listStyles.name}>{category.englishName}</p>
          <div className={listStyles.edit}>
            <button onClick={() => handleEdit(category)}>
              <FaPencilAlt size="0.7rem" style={{ color: 'white' }} /> Edit
            </button>
          </div>
        </div>
      ))}

      {/* Add Menu */}
      <AddItem handleClick={setAddModalOpen}>
        <FaPlus /> Add Category
      </AddItem>

      {/* Edit Modal */}
      {editModalOpen ? (
        <Modal handleClick={() => setEditModalOpen(false)}>
          <div className={modalStyles.form}>
            <h1>Edit Category</h1>
            <p>ID</p>
            <input
              style={editCategory?.id !== newId ? { color: 'red' } : undefined}
              onChange={(e) => setNewId(e.target.value.trim())}
              defaultValue={newId ? newId : undefined}
              type="text"
            />
            <p>English Name</p>
            <input
              style={
                editCategory?.englishName !== newEnglishName
                  ? { color: 'red' }
                  : undefined
              }
              onChange={(e) => setNewEnglishName(e.target.value.trim())}
              defaultValue={newEnglishName ? newEnglishName : undefined}
              type="text"
            />

            <p>Korean Name</p>
            <input
              style={
                editCategory?.koreanName !== newKoreanName
                  ? { color: 'red' }
                  : undefined
              }
              onChange={(e) => setNewKoreanName(e.target.value.trim())}
              defaultValue={newKoreanName ? newKoreanName : undefined}
              type="text"
            />

            {editCategory?.id !== newId && idExists(newId) ? (
              <p className={modalStyles.message}>
                Category with id {newId} already exists!
              </p>
            ) : null}
          </div>

          <div className={modalStyles.buttons}>
            <button onClick={() => setEditModalOpen(false)}>Close</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={edit} disabled={editDisabled}>
              Edit
            </button>
          </div>
        </Modal>
      ) : null}

      {/* Add Modal */}
      {addModalOpen ? (
        <Modal handleClick={handleAddModalClose}>
          <div className={modalStyles.form}>
            <h1>Add Category</h1>
            <p>ID *</p>
            <input
              onChange={(e) => setId(e.target.value.trim())}
              type="text"
              placeholder="ID"
            />
            <p>English Name *</p>
            <input
              onChange={(e) => setEnglishName(e.target.value.trim())}
              type="text"
              placeholder="English Name"
            />
            <p>Korean Name *</p>
            <input
              onChange={(e) => setKoreanName(e.target.value.trim())}
              type="text"
              placeholder="Korean Name"
            />

            {idExists(id) ? (
              <p className={modalStyles.message}>
                Category with id {id} already exists!
              </p>
            ) : null}
          </div>

          <div className={modalStyles.buttons}>
            <button onClick={handleAddModalClose}>Close</button>
            <button onClick={add} disabled={addDisabled}>
              Add
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

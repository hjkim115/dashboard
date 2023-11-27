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
  const [editOpen, setEditOpen] = useState(false)
  const [newId, setNewId] = useState<string>('')
  const [newEnglishName, setNewEnglishName] = useState<string>('')
  const [newKoreanName, setNewKoreanName] = useState<string>('')

  //Add
  const [addOpen, setAddOpen] = useState(false)
  const [id, setId] = useState('')
  const [englishName, setEnglishName] = useState('')
  const [koreanName, setKoreanName] = useState('')

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  useEffect(() => {
    async function fetchCategories(store: string) {
      const data = await getAllCategories(store)
      setCategories(data)
    }

    if (store) {
      fetchCategories(store)
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
  // if (editModalOpen || addOpen) {
  //   document.body.classList.add(modalStyles.activeModal)
  // } else {
  //   document.body.classList.remove(modalStyles.activeModal)
  // }

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
    setEditOpen(true)
  }

  function handleAddModalClose() {
    setAddOpen(false)
    setId('')
    setEnglishName('')
    setKoreanName('')
  }

  async function edit(
    e: React.FormEvent<HTMLFormElement>,
    editCategory: Category,
    newId: string,
    newEnglishName: string,
    newKoreanName: string,
    store: string
  ) {
    e.preventDefault()

    setEditOpen(false)

    const newCategory: Category = {
      id: newId,
      englishName: newEnglishName,
      koreanName: newKoreanName,
    }
    await updateCategory(store, editCategory.id, newCategory)

    const newCategories = await getAllCategories(store)
    setCategories(newCategories)
  }

  async function handleDelete(editCategory: Category, store: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      setEditOpen(false)
      await deleteCategory(store, editCategory.id)
      const newCategories = await getAllCategories(store)
      setCategories(newCategories)
    }
  }

  async function add(e: React.FormEvent<HTMLFormElement>, store: string) {
    e.preventDefault()
    const category: Category = {
      id: id,
      englishName: englishName,
      koreanName: koreanName,
    }
    await postCategory(store, category)

    const newCategories = await getAllCategories(store)
    setCategories(newCategories)

    handleAddModalClose()
  }

  if (!(categories && store)) {
    return <LoadingPage />
  }

  return (
    <div className={categoriesStyles.categoriesContainer}>
      <h1>Categories</h1>
      <Label />

      {categories.map((category) => (
        <div className={listStyles.item}>
          <p className={listStyles.name}>{category.englishName}</p>
          <FaPencilAlt onClick={() => handleEdit(category)} />
        </div>
      ))}

      {/* Add Menu */}
      <AddItem handleClick={setAddOpen}>
        <FaPlus /> Add Category
      </AddItem>

      {/* Edit Modal */}
      {editOpen ? (
        <Modal handleClick={() => setEditOpen(false)}>
          {editCategory ? (
            <form
              id="editCategoryForm"
              onSubmit={(e) =>
                edit(
                  e,
                  editCategory,
                  newId,
                  newEnglishName,
                  newKoreanName,
                  store
                )
              }
              className={modalStyles.form}
            >
              <h1>Edit Category</h1>
              <p>ID</p>
              <input
                style={
                  editCategory?.id !== newId ? { color: 'red' } : undefined
                }
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
            </form>
          ) : null}

          <div className={modalStyles.buttons}>
            <button onClick={() => setEditOpen(false)}>Close</button>

            {editCategory ? (
              <button onClick={() => handleDelete(editCategory, store)}>
                Delete
              </button>
            ) : null}

            <button
              type="submit"
              form="editCategoryForm"
              disabled={editDisabled}
            >
              Edit
            </button>
          </div>
        </Modal>
      ) : null}

      {/* Add Modal */}
      {addOpen ? (
        <Modal handleClick={handleAddModalClose}>
          <form
            id="addCategoryForm"
            onSubmit={(e) => add(e, store)}
            className={modalStyles.form}
          >
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
          </form>

          <div className={modalStyles.buttons}>
            <button onClick={handleAddModalClose}>Close</button>
            <button type="submit" form="addCategoryForm" disabled={addDisabled}>
              Add
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

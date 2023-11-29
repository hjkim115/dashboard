'use client'

import listStyles from '../../styles/list.module.css'
import tableStyles from '../../styles/tables.module.css'
import formStyles from '../../styles/form.module.css'
import { useState, useEffect, useContext } from 'react'
import { Table } from '../../utils/types'
import {
  deleteTable,
  getAllTables,
  postTable,
  updateTable,
} from '../../utils/firebase'
import { FaPencilAlt, FaPlus } from 'react-icons/fa'
import Label from '../../components/Label'
import AddItem from '../../components/AddItem'
import Modal from '../../components/Modal'
import LoadingPage from '../../components/LoadingPage'
import { AuthContext } from '@/app/context/AuthContext'

export default function Tables() {
  const [tables, setTables] = useState<Table[] | null>(null)
  //Edit
  const [editTable, setEditTable] = useState<Table | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [newId, setNewId] = useState<string>('')
  const [newTableNumber, setNewTableNumber] = useState<string>('')

  //Add
  const [addOpen, setAddOpen] = useState(false)
  const [id, setId] = useState('')
  const [tableNumber, setTableNumber] = useState('')

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  useEffect(() => {
    async function fetchTables(store: string) {
      const data = await getAllTables(store)
      setTables(data)
    }

    if (store) {
      fetchTables(store)
    }
  }, [store])

  // Disabled
  const editDisabled =
    (editTable?.id === newId && editTable?.tableNumber === newTableNumber) ||
    newId === '' ||
    newTableNumber === '' ||
    idExists(newId)

  const addDisabled = id === '' || tableNumber === '' || idExists(id)

  //Modal Scroll
  // if (editOpen || addOpen) {
  //   document.body.classList.add(modalStyles.activeModal)
  // } else {
  //   document.body.classList.remove(modalStyles.activeModal)
  // }

  function idExists(id: string) {
    if (tables) {
      for (const table of tables) {
        if (table.id === id) {
          return true
        }
      }
      return false
    }
  }

  function handleEditOpen(table: Table) {
    setEditTable(table)
    setNewId(table.id)
    setNewTableNumber(table.tableNumber)
    setEditOpen(true)
  }

  function handleAddClose() {
    setAddOpen(false)
    setId('')
    setTableNumber('')
  }

  async function edit(
    e: React.FormEvent<HTMLFormElement>,
    editTable: Table,
    newId: string,
    newTableNumber: string,
    store: string
  ) {
    e.preventDefault()

    setEditOpen(false)

    const table: Table = {
      id: newId,
      tableNumber: newTableNumber,
    }

    await updateTable(store, editTable.id, table)

    const newTables = await getAllTables(store)
    setTables(newTables)
  }

  async function handleDelete(editTable: Table, store: string) {
    if (confirm('Are you sure you want to delete this table?')) {
      setEditOpen(false)
      await deleteTable(store, editTable.id)
      const newTables = await getAllTables(store)
      setTables(newTables)
    }
  }

  async function add(e: React.FormEvent<HTMLFormElement>, store: string) {
    e.preventDefault()
    const table: Table = {
      id: id,
      tableNumber: tableNumber,
    }
    await postTable(store, table)

    const newTables = await getAllTables(store)
    setTables(newTables)

    handleAddClose()
  }

  if (!(tables && store)) {
    return <LoadingPage />
  }

  return (
    <div className={tableStyles.tablesContainer}>
      <h1>Tables</h1>
      {tables ? <Label /> : null}

      {tables?.map((table) => (
        <div className={listStyles.item}>
          <p className={listStyles.name}>Table {table.tableNumber}</p>
          <FaPencilAlt onClick={() => handleEditOpen(table)} />
        </div>
      ))}

      {/* Add Menu */}
      <AddItem handleClick={setAddOpen}>
        <FaPlus /> Add Table
      </AddItem>

      {/* Edit Modal */}
      {editOpen ? (
        <Modal handleClick={() => setEditOpen(false)}>
          {editTable ? (
            <form
              id="editTableForm"
              onSubmit={(e) => edit(e, editTable, newId, newTableNumber, store)}
              className={formStyles.form}
            >
              <h1>Edit Table</h1>
              <p>ID</p>
              <input
                style={editTable?.id !== newId ? { color: 'red' } : undefined}
                onChange={(e) => setNewId(e.target.value.trim())}
                defaultValue={newId ? newId : undefined}
                type="text"
              />
              <p>Table Number</p>
              <input
                style={
                  editTable?.tableNumber !== newTableNumber
                    ? { color: 'red' }
                    : undefined
                }
                onChange={(e) => setNewTableNumber(e.target.value.trim())}
                defaultValue={newTableNumber ? newTableNumber : undefined}
                type="text"
              />

              {editTable?.id !== newId && idExists(newId) ? (
                <p className={formStyles.message}>
                  Table with id {newId} already exists!
                </p>
              ) : null}
            </form>
          ) : null}

          <div className={formStyles.buttons}>
            <button onClick={() => setEditOpen(false)}>Close</button>
            {editTable ? (
              <button onClick={() => handleDelete(editTable, store)}>
                Delete
              </button>
            ) : null}
            <button type="submit" form="editTableForm" disabled={editDisabled}>
              Edit
            </button>
          </div>
        </Modal>
      ) : null}

      {/* Add Modal */}
      {addOpen ? (
        <Modal handleClick={handleAddClose}>
          <form
            id="addTableForm"
            onSubmit={(e) => add(e, store)}
            className={formStyles.form}
          >
            <h1>Add Table</h1>
            <p>ID *</p>
            <input
              onChange={(e) => setId(e.target.value.trim())}
              type="text"
              placeholder="ID"
            />
            <p>Table Number *</p>
            <input
              onChange={(e) => setTableNumber(e.target.value.trim())}
              type="text"
              placeholder="Table Number"
            />

            {idExists(id) ? (
              <p className={formStyles.message}>
                Table with id {id} already exists!
              </p>
            ) : null}
          </form>

          <div className={formStyles.buttons}>
            <button onClick={handleAddClose}>Close</button>
            <button type="submit" form="addTableForm" disabled={addDisabled}>
              Add
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

'use client'

import listStyles from '../../styles/list.module.css'
import tableStyles from '../../styles/tables.module.css'
import modalStyles from '../../styles/modal.module.css'
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
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [newId, setNewId] = useState<string>('')
  const [newTableNumber, setNewTableNumber] = useState<string>('')

  //Add
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [id, setId] = useState('')
  const [tableNumber, setTableNumber] = useState('')

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  useEffect(() => {
    async function fetchTables() {
      if (typeof store !== 'string') {
        throw Error('Type of store should be string!')
      }
      const data = await getAllTables(store)
      setTables(data)
    }

    if (store) {
      fetchTables()
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
  if (editModalOpen || addModalOpen) {
    document.body.classList.add(modalStyles.activeModal)
  } else {
    document.body.classList.remove(modalStyles.activeModal)
  }

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

  function handleEdit(table: Table) {
    setEditTable(table)
    setNewId(table.id)
    setNewTableNumber(table.tableNumber)
    setEditModalOpen(true)
  }

  function handleAddModalClose() {
    setAddModalOpen(false)
    setId('')
    setTableNumber('')
  }

  function checkSort(a: Table, b: Table) {
    if (a.id > b.id) {
      return 1
    }
    if (a.id < b.id) {
      return -1
    }
    return 0
  }

  async function edit() {
    if (!tables) {
      throw Error('tables is not set!')
    }
    if (!editTable) {
      throw Error('editTable is not set!')
    }
    if (!newId) {
      throw Error('newId is not set!')
    }
    if (!newTableNumber) {
      throw Error('newTableNumber is not set!')
    }
    if (typeof store !== 'string') {
      throw Error('Type of store should be string!')
    }

    setEditModalOpen(false)

    const table: Table = {
      id: newId,
      tableNumber: newTableNumber,
    }

    await updateTable(store, editTable.id, table)

    const newTables = [...tables]

    for (const table of newTables) {
      if (table.id === editTable.id) {
        table.id = newId
        table.tableNumber = newTableNumber
      }
    }

    newTables.sort(checkSort)
    setTables(newTables)
  }

  async function handleDelete() {
    if (!tables) {
      throw Error('tables is not set!')
    }
    if (!editTable) {
      throw Error('editTable is not set!')
    }
    if (typeof store !== 'string') {
      throw Error('Type of store should be string!')
    }

    if (confirm('Are you sure you want to delete this table?')) {
      setEditModalOpen(false)
      await deleteTable(store, editTable.id)
      const newTables = []
      for (const table of tables) {
        if (table.id === editTable.id) {
          continue
        }
        newTables.push(table)
      }
      setTables(newTables)
    }
  }

  async function add() {
    if (!tables) {
      throw Error('tables is not set!')
    }
    if (typeof store !== 'string') {
      throw Error('Type of store should be string!')
    }

    const table: Table = {
      id: id,
      tableNumber: tableNumber,
    }
    await postTable(store, table)
    handleAddModalClose()
    const newTables = [...tables]
    newTables.push(table)
    newTables.sort(checkSort)
    setTables(newTables)
  }

  if (!tables) {
    return <LoadingPage />
  }

  return (
    <div className={tableStyles.tablesContainer}>
      <h1>Tables</h1>
      {tables ? <Label /> : null}

      {tables?.map((table) => (
        <div className={listStyles.item}>
          <p className={listStyles.name}>Table {table.tableNumber}</p>
          <div className={listStyles.edit}>
            <button onClick={() => handleEdit(table)}>
              <FaPencilAlt size="0.7rem" style={{ color: 'white' }} /> Edit
            </button>
          </div>
        </div>
      ))}

      {/* Add Menu */}
      <AddItem handleClick={setAddModalOpen}>
        <FaPlus /> Add Table
      </AddItem>

      {/* Edit Modal */}
      {editModalOpen ? (
        <Modal handleClick={() => setEditModalOpen(false)}>
          <div className={modalStyles.form}>
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
              <p className={modalStyles.message}>
                Table with id {newId} already exists!
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
              <p className={modalStyles.message}>
                Table with id {newId} already exists!
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

'use client'

import listStyles from '../../styles/list.module.css'
import { useState, useEffect, useContext } from 'react'
import { Table } from '../../utils/types'
import { getAllTables } from '../../utils/firebase'
import { FaPencilAlt, FaPlus } from 'react-icons/fa'
import Modal from '../../components/Modal'
import LoadingPage from '../../components/LoadingPage'
import { AuthContext } from '@/app/context/AuthContext'
import AddTableForm from '@/app/components/modalForms/AddTableForm'
import EditTableForm from '@/app/components/modalForms/EditTableForm'

export default function Tables() {
  const [tables, setTables] = useState<Table[] | null>(null)

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  //Edit
  const [editOpen, setEditOpen] = useState(false)
  const [editTable, setEditTable] = useState<Table>({} as Table)

  //Add
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    async function fetchTables(store: string) {
      const data = await getAllTables(store)
      setTables(data)
    }

    if (store) {
      fetchTables(store)
    }
  }, [store])

  function handleEditOpen(table: Table) {
    setEditTable(table)
    setEditOpen(true)
  }

  if (!(tables && store)) {
    return <LoadingPage />
  }

  return (
    <div className={listStyles.listContainer}>
      <h1>Tables</h1>

      {/* Label */}
      <div className={listStyles.label}>
        <p className={listStyles.name}>Name</p>
      </div>

      {/* Tables */}
      {tables?.map((table, i) => (
        <div className={listStyles.item}>
          <p className={listStyles.name}>
            {i + 1}. Table {table.tableNumber}
          </p>
          <FaPencilAlt onClick={() => handleEditOpen(table)} />
        </div>
      ))}

      {/* Add Table */}
      <button className="addButton" onClick={() => setAddOpen(true)}>
        <FaPlus /> Add Table
      </button>

      {/* Modals */}
      {/* Edit */}
      <Modal handleClick={() => setEditOpen(false)} isOpen={editOpen}>
        <EditTableForm
          store={store}
          setOpen={setEditOpen}
          tables={tables}
          setTables={setTables}
          editTable={editTable}
        />
      </Modal>

      {/* Add */}
      <Modal handleClick={() => setAddOpen(false)} isOpen={addOpen}>
        <AddTableForm
          store={store}
          setOpen={setAddOpen}
          tables={tables}
          setTables={setTables}
        />
      </Modal>
    </div>
  )
}

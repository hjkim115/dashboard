'use client'

import { useState, useEffect, useContext } from 'react'
import Label from '../../components/Label'
import imagesStyles from '../../styles/images.module.css'
import listStyles from '../../styles/list.module.css'
import modalStyles from '../../styles/modal.module.css'
import { server } from '../../utils/config'
import { FaPencilAlt, FaCopy, FaPlus } from 'react-icons/fa'
import AddItem from '../../components/AddItem'
import Modal from '../../components/Modal'
import Link from 'next/link'
import LoadingPage from '../../components/LoadingPage'
import { AuthContext } from '@/app/context/AuthContext'

export default function Images() {
  const [imageNames, setImageNames] = useState<string[] | null>(null)

  const { user } = useContext(AuthContext)
  const store = user?.displayName
  //Add
  const [addModalOpen, setAddModalOpen] = useState(false)

  //Edit
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    async function fetchImageNames() {
      if (typeof store !== 'string') {
        throw Error('Type of store should be string!')
      }

      const res = await fetch(`${server}/api/imageNames?store=${store}`)
      const data = await res.json()

      setImageNames(data)
    }

    if (store) {
      fetchImageNames()
    }
  }, [store])

  function handleEdit() {
    setEditModalOpen(true)
  }

  function handleAddModalClose() {
    setAddModalOpen(false)
  }

  if (!imageNames) {
    return <LoadingPage />
  }

  return (
    <div className={imagesStyles.imagesContainer}>
      <h1>Images</h1>
      <Label />

      {imageNames.map((imageName) => (
        <div className={listStyles.item}>
          <Link
            href={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/${store}/${imageName}`}
            rel="noopener noreferrer"
            target="_blank"
            className={listStyles.link}
          >
            {imageName}
          </Link>
          <FaCopy
            className={listStyles.copy}
            size="1rem"
            onClick={() => {
              navigator.clipboard.writeText(imageName)
              alert(`Copied Text ${imageName}`)
            }}
          />
          <div className={listStyles.edit}>
            <button onClick={handleEdit}>
              <FaPencilAlt size="0.7rem" style={{ color: 'white' }} /> Edit
            </button>
          </div>
        </div>
      ))}

      {/* Add Menu */}
      <AddItem handleClick={() => setAddModalOpen(true)}>
        <FaPlus /> Add Image
      </AddItem>

      {/* Edit Modal */}
      {editModalOpen ? (
        <Modal handleClick={() => setEditModalOpen(false)}>
          <div className={modalStyles.form}>
            <h1>Edit Image</h1>
            <p>Image Name</p>
            <input type="text" />
            <p>Image</p>
            <input type="file" />
          </div>

          <div className={modalStyles.buttons}>
            <button onClick={() => setEditModalOpen(false)}>Close</button>
            <button>Edit</button>
          </div>
        </Modal>
      ) : null}

      {/* Add Modal */}
      {addModalOpen ? (
        <Modal handleClick={handleAddModalClose}>
          <div className={modalStyles.form}>
            <h1>Add Image</h1>
            <p>Image Name *</p>
            <input type="text" />
            <p>Image *</p>
            <input type="file" />
          </div>

          <div className={modalStyles.buttons}>
            <button onClick={handleAddModalClose}>Close</button>
            <button>Add</button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

import { useEffect } from 'react'
import modalStyles from './styles/modal.module.css'

type ModalProps = {
  children: React.ReactNode
  handleClick: () => void
  isOpen: boolean
}

export default function Modal({ children, handleClick, isOpen }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add(modalStyles.noScroll)
    } else {
      document.body.classList.remove(modalStyles.noScroll)
    }
  }, [isOpen])

  return (
    <>
      {isOpen ? (
        <div className={modalStyles.modalContainer}>
          <div onClick={handleClick} className={modalStyles.overlay} />
          <div className={modalStyles.content}>{children}</div>
        </div>
      ) : null}
    </>
  )
}

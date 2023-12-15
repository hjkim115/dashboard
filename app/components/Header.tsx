'use client'

import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import headerStyles from './styles/header.module.css'
import { useRouter, usePathname } from 'next/navigation'
import { FaBars, FaTimes, FaPowerOff, FaHome, FaCog } from 'react-icons/fa'
import Loading from './Loading'
import { AuthContext } from '../context/AuthContext'
import { SettingsContext } from '../context/SettingsContext'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logOut } = useContext(AuthContext)
  const store = user?.displayName

  const { settings } = useContext(SettingsContext)
  const companyName = settings?.name
  const logoImageName = settings?.logoImageName

  const router = useRouter()
  const pathName = usePathname()

  const links: {
    [key: string]: string
  } = {
    Categories: '/update/categories',
    Menus: '/update/menus',
    Tables: '/update/tables',
  }

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add(headerStyles.noScroll)
    } else {
      document.body.classList.remove(headerStyles.noScroll)
    }
  }, [isOpen])

  async function handleLogOut() {
    if (confirm('Are you sure you want to log out?')) {
      await logOut()
    } else {
      return
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className={headerStyles.headerContainer}>
      <div className={headerStyles.logoImage}>
        <div
          style={{
            backgroundImage: `url('${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/${store}/${logoImageName}')`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: '7rem',
            height: '7rem',
            borderRadius: '50%',
          }}
        />
      </div>

      <div
        className={`${headerStyles.companyName} ${
          pathName === '/'
            ? headerStyles.companyNameActive
            : headerStyles.companyNameInactive
        }`}
      >
        {companyName ? (
          <Link onClick={() => setIsOpen(false)} href="/">
            {companyName}
          </Link>
        ) : (
          <div className={headerStyles.loading}>
            <Loading size="1.2rem" />
          </div>
        )}
      </div>
      <div className={headerStyles.buttons}>
        {pathName !== '/' ? (
          <FaHome
            className={headerStyles.home}
            onClick={() => {
              router.push('/')
              setIsOpen(false)
            }}
            size="1.2rem"
          />
        ) : null}

        <FaCog
          className={headerStyles.settings}
          onClick={() => {
            router.push('/update/settings')
            setIsOpen(false)
          }}
          size="1.2rem"
        />

        <FaPowerOff
          className={headerStyles.logOut}
          onClick={() => {
            handleLogOut()
            setIsOpen(false)
          }}
          size="1.2rem"
        />

        {/* Menu Icon */}
        {pathName !== '/update/editMenu' ? (
          <>
            {isOpen ? (
              <FaTimes
                className={headerStyles.navbarToggle}
                onClick={() => setIsOpen(!isOpen)}
                size="1.2rem"
              />
            ) : (
              <FaBars
                className={headerStyles.navbarToggle}
                onClick={() => setIsOpen(!isOpen)}
                size="1.2rem"
              />
            )}
          </>
        ) : null}
      </div>

      <div
        style={isOpen ? { display: 'flex' } : undefined}
        className={headerStyles.navbar}
      >
        {Object.keys(links).map((key) => (
          <Link
            className={
              pathName === links[key]
                ? headerStyles.linkActive
                : headerStyles.linkInactive
            }
            onClick={() => setIsOpen(false)}
            href={links[key]}
          >
            {key}
          </Link>
        ))}
      </div>

      <div
        style={isOpen ? { display: 'flex' } : undefined}
        className={headerStyles.overlay}
        onClick={() => setIsOpen(false)}
      />
    </div>
  )
}

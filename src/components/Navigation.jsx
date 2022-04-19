import { Fragment, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
import { useAuth } from '/src/hooks/useAuth.jsx'
import Icon from './Icon.jsx'
import clsx from 'clsx'

const defaultUserProfile = {
  avatar: `https://i.pravatar.cc/100?u=${Math.random()
    .toString(36)
    .substring(2)}`,
  email: 'Guest',
}

export default function Navigation() {
  const { logout, user } = useAuth()
  const { chatroomId } = useParams()

  const [userProfile, setUserProfile] = useState(defaultUserProfile)

  const title = () => {
    if (!!chatroomId === false) return ''
    return chatroomId === '1' ? 'Public room' : `Chat #${chatroomId}`
  }

  const avatarLinks = [
    {
      text: 'Account',
      icon: <Icon icon="User" />,
      to: '/my/account',
      disabled: false,
    },
    {
      text: 'Setting',
      icon: <Icon icon="Adjustments" />,
      to: '/my/setting',
      disabled: true,
    },
    {
      text: 'Log out',
      icon: <Icon icon="Logout" />,
      to: null,
      onClick: () => {
        logout()
      },
      disabled: false,
    },
  ]

  useEffect(() => {
    setUserProfile({
      email: user?.email,
      avatar: user?.photoURL,
    })
  }, [user])

  return (
    <nav className="sticky top-0 left-0 z-40 w-full bg-white shadow">
      <div className="flex gap-4 py-3 px-4">
        <div className="flex items-center">
          <Link to="/chat/1">
            <h1 className="font-bold">Real Chat</h1>
          </Link>
        </div>
        <div className="flex flex-grow justify-between">
          <div className="flex items-center">
            <h2>{title()}</h2>
          </div>
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex items-center gap-4 rounded-full">
              <div className="flex h-8 w-8 overflow-hidden rounded-full border-2 border-green-400 transition-transform hover:scale-105">
                <img src={userProfile.avatar} alt="User avatar" />
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="divide-y-2 divide-gray-100 p-2">
                  <Menu.Item>
                    <div className="flex gap-4 py-4 px-2 text-xs">
                      <div className="h-12 w-12 overflow-hidden rounded-lg">
                        <img src={userProfile.avatar} alt="User avatar" />
                      </div>
                      <ul className="text-gray-700">
                        <li className="flex items-center gap-2">
                          <span>
                            <Icon icon="Mail" />
                          </span>
                          {userProfile.email}
                        </li>
                      </ul>
                    </div>
                  </Menu.Item>
                  {avatarLinks.map((link, index) => {
                    return (
                      <div className="py-1" key={`avatar-link-${index}`}>
                        <Menu.Item disabled={link.disabled}>
                          {({ active }) => {
                            return (
                              <button
                                className={clsx(
                                  active && 'bg-green-500 text-white',
                                  !link.disabled
                                    ? 'hover:bg-green-500 hover:text-white'
                                    : 'pointer-events-none text-gray-300',

                                  'w-full rounded-md p-2 text-sm transition-colors'
                                )}
                                disabled={link.disabled}
                              >
                                {link.to ? (
                                  <Link
                                    className={clsx([
                                      link.disabled && 'cursor-default',
                                      'flex w-full items-center gap-2',
                                    ])}
                                    to={link.to}
                                  >
                                    <div>{link.icon}</div>
                                    <span>{link.text}</span>
                                  </Link>
                                ) : (
                                  <div
                                    className="flex w-full items-center gap-2"
                                    onClick={link.onClick}
                                  >
                                    <div>{link.icon}</div>
                                    <span>{link.text}</span>
                                  </div>
                                )}
                              </button>
                            )
                          }}
                        </Menu.Item>
                      </div>
                    )
                  })}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </nav>
  )
}

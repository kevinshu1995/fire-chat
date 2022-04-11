import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
import Icon from './Icon.jsx'
import clsx from 'clsx'

export default function Navigation() {
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
      disabled: false,
    },
  ]

  return (
    <nav className="sticky top-0 left-0 z-40 w-full bg-white shadow">
      <div className="flex gap-4 py-2 px-4">
        <div className="flex items-center">
          <Link to="/chat/1">
            <h1 className="font-bold">Real Chat</h1>
          </Link>
        </div>
        <div className="flex flex-grow justify-between">
          <div className="flex items-center">
            <h2>Public chat</h2>
          </div>
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex h-10 w-10 overflow-hidden rounded-full border-2 border-green-400 transition-transform hover:scale-105">
              <img src="https://i.pravatar.cc/300" alt="User avatar" />
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
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-2">
                  {avatarLinks.map((link, index) => {
                    return (
                      <Menu.Item
                        disabled={link.disabled}
                        key={`avatar-link-${index}`}
                      >
                        {({ active }) => {
                          return (
                            <Link
                              className={clsx(
                                active
                                  ? 'bg-green-500 text-white'
                                  : 'text-gray-900',
                                'flex w-full items-center gap-2 rounded-md p-2 text-sm transition-colors'
                              )}
                              to={link.to}
                            >
                              <div>{link.icon}</div>
                              <span>{link.text}</span>
                            </Link>
                          )
                        }}
                      </Menu.Item>
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

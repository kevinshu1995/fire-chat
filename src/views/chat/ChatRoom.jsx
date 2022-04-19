import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { updateDbUserId } from '/src/api/user.js'
import { pushMessage, observeMessage } from '/src/api/message.js'
import dayjs from 'dayjs'

export default function ChatRoom() {
  const { chatroomId } = useParams()
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [isAbleToSend, setIsAbleToSend] = useState(false)
  const roomId = chatroomId

  const isMineMsg = (message) => {
    if (user === null || message?.user?.id === undefined) return false
    return message.user.id === user.id
  }

  const onSubmitMsg = async (e) => {
    e.preventDefault()
    setIsAbleToSend(false)

    const value = new FormData(e.target).get('message')
    if (value === '') return

    try {
      await pushMessage({ roomId, message: value, user })
    } catch (error) {
      console.error('push message error', error)
    }

    e.target.reset()
    setIsAbleToSend(true)
  }

  useEffect(async () => {
    const userInfo = await updateDbUserId()

    setUser(userInfo)

    await observeMessage({
      roomId,
      msgQuantity: 50,
      successCb: (returnMsgs) => {
        setMessages([...returnMsgs])
      },
      failedCb: () => {
        setMessages([])
        console.log('failed')
      },
    })

    setIsAbleToSend(true)
  }, [])

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-grow">
        {/* messages */}
        <div className="w-full self-stretch">
          <ul className="flex h-full flex-col-reverse gap-2 p-4">
            {[...messages].reverse().map((msg, index) =>
              isMineMsg(msg) ? (
                <li key={index} className="ml-auto flex flex-col items-end">
                  <p
                    className="peer rounded-md bg-teal-200 px-3 py-2 shadow-sm"
                    tabIndex="-1"
                  >
                    {msg.message}
                  </p>
                  <span className="block text-xs text-gray-400 opacity-0 transition-all peer-focus:pt-1 peer-focus:opacity-100">
                    {dayjs(msg.createdAt).format('YYYY/MM/DD HH:mm')}
                  </span>
                </li>
              ) : (
                <li key={index} className="mr-auto flex flex-col items-start">
                  <p
                    className="peer rounded-md bg-gray-300 px-3 py-2 shadow-sm"
                    tabIndex="-1"
                  >
                    {msg.message}
                  </p>
                  <span className="block text-xs text-gray-400 opacity-0 transition-all peer-focus:pt-1 peer-focus:opacity-100">
                    {dayjs(msg.createdAt).format('YYYY/MM/DD HH:mm')}
                  </span>
                </li>
              )
            )}

            <li className="text-center text-gray-400">
              You just reached the top.
            </li>
          </ul>
        </div>
      </div>

      {/* message form */}
      <form
        onSubmit={onSubmitMsg}
        className="sticky bottom-0 left-0 w-full bg-teal-100 p-4"
      >
        <input
          type="text"
          name="message"
          className="w-full bg-white p-2 disabled:cursor-wait disabled:opacity-75"
          placeholder="type message here..."
          disabled={isAbleToSend === false}
        />
      </form>
    </div>
  )
}

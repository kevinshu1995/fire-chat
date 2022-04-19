import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { updateDbUserId } from '/src/api/user.js'
import { useAuth } from '/src/hooks/useAuth.jsx'
import { pushMessage, observeMessage } from '/src/api/message.js'
import dayjs from 'dayjs'
import clsx from 'clsx'

export default function ChatRoom() {
  const { chatroomId } = useParams()
  const { user } = useAuth()
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

  const isShowMsgDetail = (msg, index, msgAry) => {
    const isFirstMsg = !msgAry[index + 1]

    const previousUid = !!msgAry[index + 1] ? msgAry[index + 1].user.uid : null
    const currentUid = msg.user.uid
    const isSameGuyAsPrevious = previousUid === currentUid

    const currentTime = dayjs(msg.createdAt).format('YYYYMMDDHHmm')
    const previousTime = !!msgAry[index + 1]
      ? dayjs(msgAry[index + 1].createdAt).format('YYYYMMDDHHmm')
      : null
    const isSameMinute = currentTime === previousTime

    if (isFirstMsg === true) return true
    if (isSameGuyAsPrevious === false) return true
    return isSameMinute === false
  }

  useEffect(async () => {
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
          <ul className="flex h-full flex-col-reverse p-4">
            {[...messages].reverse().map((msg, index, msgAry) =>
              isMineMsg(msg) ? (
                <li
                  key={index}
                  className={clsx([
                    'ml-auto flex items-end gap-4',
                    isShowMsgDetail(msg, index, msgAry) ? 'pt-4' : 'pt-1',
                  ])}
                >
                  <div className="flex flex-col items-end gap-2">
                    {isShowMsgDetail(msg, index, msgAry) && (
                      <MsgCaption msg={msg} />
                    )}
                    <Message bg="bg-teal-200" msg={msg} />
                  </div>
                  <Avatar
                    photo={msg.user.photoURL}
                    className={clsx([
                      isShowMsgDetail(msg, index, msgAry) === false &&
                        'opacity-0',
                    ])}
                  />
                </li>
              ) : (
                <li
                  key={index}
                  className={clsx([
                    'mr-auto flex flex-row-reverse items-start gap-4',
                    isShowMsgDetail(msg, index, msgAry) ? 'pt-4' : 'pt-1',
                  ])}
                >
                  <div className="flex flex-col gap-2">
                    {isShowMsgDetail(msg, index, msgAry) && (
                      <MsgCaption msg={msg} reverse />
                    )}
                    <Message bg="bg-gray-300" msg={msg} reverse />
                  </div>
                  <Avatar
                    photo={msg.user.photoURL}
                    className={clsx([
                      isShowMsgDetail(msg, index, msgAry) === false &&
                        'opacity-0',
                    ])}
                  />
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

function Avatar({ photo, className }) {
  return (
    <div
      className={clsx([
        'mt-1 h-10 w-10 self-start overflow-hidden rounded-full',
        className,
      ])}
    >
      <img src={photo} alt="Message owner photo" />
    </div>
  )
}

function MsgCaption({ msg, reverse }) {
  return (
    <p
      className={clsx([
        'flex gap-4 text-xs font-light text-gray-400',
        reverse && 'flex-row-reverse',
      ])}
    >
      <span>{dayjs(msg.createdAt).format('YYYY/MM/DD HH:mm')}</span>
      <span>{msg.user.displayName}</span>
    </p>
  )
}

function Message({ msg, bg, reverse }) {
  return (
    <p
      className={clsx([
        'rounded-md px-3 py-2 shadow-sm',
        reverse ? 'self-start' : 'self-end',
        bg,
      ])}
      tabIndex="-1"
    >
      {msg.message}
    </p>
  )
}

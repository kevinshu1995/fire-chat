import { database } from './firebase'

import {
  ref,
  set,
  push,
  onValue,
  query,
  limitToLast,
  serverTimestamp,
} from 'firebase/database'

export function pushMessage({ roomId, message, user }) {
  if (!roomId || !message || !user)
    throw new Error(
      'Error! postMessage() roomId or message or user should be passed'
    )

  const messageListRef = ref(database, `rooms/${roomId}/messages`)
  const newMessageRef = push(messageListRef)

  return set(newMessageRef, {
    user,
    message,
    createdAt: serverTimestamp(),
  })
}

export function observeMessage({
  roomId = 1,
  msgQuantity = 50,
  successCb,
  errorCb,
}) {
  try {
    const recentMessagesRef = query(
      ref(database, `rooms/${roomId}/messages`),
      limitToLast(msgQuantity)
    )

    // TODO runTransaction
    return onValue(
      recentMessagesRef,
      (snapshot) => {
        if (snapshot.val() === null) {
          successCb([])
        } else {
          successCb(Object.values(snapshot.val()))
        }
      },
      (error) => {
        console.error('observeMessage onValue failed', error)
        errorCb()
      }
    )
  } catch (error) {
    throw new Error('observeMessage failed', error)
  }
}

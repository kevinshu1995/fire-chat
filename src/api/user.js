import { database } from './firebase'
import { handleLocalStorage } from '../util/storage.js'

import {
  ref,
  get,
  child,
  set,
  update,
  serverTimestamp,
} from 'firebase/database'

const storageKey = 'firebase-chat-userId'
const userLocalStorage = handleLocalStorage(storageKey)

function generateId() {
  return (
    new Date().getTime().toString(36) +
    (Math.random() + 1).toString(36).substring(7)
  )
}

function getUserId() {
  const userId = userLocalStorage.get()
  if (userId) {
    return {
      isNew: false,
      userId,
    }
  }

  const newUserId = generateId()
  userLocalStorage.set(newUserId)

  return {
    isNew: true,
    userId: newUserId,
  }
}

/**
 *  @returns {Promise}
 *  @fulfill {Object} userInfo
 *  @reject {Error}
 */
export async function updateDbUserId() {
  const { isNew, userId } = getUserId()

  const userDbPath = `users/${userId}`
  const userInfo = {
    user: {
      id: userId,
      firstJoin: serverTimestamp(),
      lastLogin: serverTimestamp(),
      nickname: 'Guest',
      email: null,
      rooms: [],
    },
    storageStatus: {
      isNewInLocalStorage: isNew,
      isNewOnDb: true,
    },
  }

  try {
    const snapshot = await get(child(ref(database), userDbPath))

    if (snapshot.exists()) {
      userInfo.user = snapshot.val()
      userInfo.user.lastLogin = serverTimestamp()
      userInfo.storageStatus.isNewOnDb = false

      await update(ref(database), {
        [`${userDbPath}/lastLogin`]: serverTimestamp(),
      })
    } else {
      await set(ref(database, userDbPath), userInfo.user)
    }

    const updatedData = await get(child(ref(database), userDbPath))
    return updatedData.val()
  } catch (error) {
    throw new Error('error while getting user id', error)
  }
}

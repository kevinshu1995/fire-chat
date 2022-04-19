import { database } from './firebase'
import { handleLocalStorage } from '../util/storage.js'

import { ref, get, child, set, update } from 'firebase/database'

/**
 *  @returns {Promise}
 *  @fulfill {Object} userInfo
 *  @reject {Error}
 *  uid required
 */
export async function updateDbUserId({
  uid,
  photoURL,
  email,
  emailVerified,
  displayName,
  isAnonymous,
}) {
  const userDbPath = `users/${uid}`

  let userInfo = {
    uid,
    displayName: displayName || 'Guest',
    photoURL,
    email,
    emailVerified,
    isAnonymous,
  }

  try {
    const snapshot = await get(child(ref(database), userDbPath))

    if (snapshot.exists()) {
      const updates = {}
      const pushUpdate = (key, value) => {
        if (value) updates[`${userDbPath}/${key}`] = value
        return pushUpdate
      }

      pushUpdate('uid', uid)
      pushUpdate('displayName', displayName)
      pushUpdate('photoURL', photoURL)
      pushUpdate('email', email)
      pushUpdate('emailVerified', emailVerified)
      pushUpdate('isAnonymous', isAnonymous)

      await update(ref(database), updates)
    } else {
      await set(ref(database, userDbPath), userInfo)
    }

    const updatedData = await get(child(ref(database), userDbPath))
    return updatedData.val()
  } catch (error) {
    console.error(error)
    throw new Error('error while getting user id', error)
  }
}

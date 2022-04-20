import { useState, useEffect, useRef } from 'react'
import { useAuth } from '/src/hooks/useAuth.jsx'
import { useToast } from '/src/hooks/useToast.jsx'
import { useLoading } from '/src/hooks/useLoading.jsx'
import Icon from '/src/components/Icon.jsx'
import clsx from 'clsx'

const currentEditInit = {
  name: null,
  value: null,
}

export default function Account() {
  const { user, updateUserProfile, updateUserEmail, sendEmailVerification } =
    useAuth()
  const [formElement, setFormElement] = useState([])
  const { toast } = useToast()
  const nameRef = useRef(null)
  const emailRef = useRef(null)

  const [currentEdit, setCurrentEdit] = useState(currentEditInit)

  const onClickEdit = (e, inputName) => {
    e.preventDefault()
    const button = e.target.closest('button')

    setCurrentEdit({
      name: inputName,
      value: new FormData(button.form).get(inputName),
    })
  }

  const uploadPhoto = async () => {
    const randomPhoto = () =>
      `https://i.pravatar.cc/100?u=${Math.random().toString(36).substring(2)}`
    const { isSuccess, message } = await updateUserProfile({
      displayName: null,
      photoURL: randomPhoto(),
    })
    if (isSuccess) {
      toast.default(message)
    } else {
      toast.error(message)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const newValue = new FormData(e.target).get(currentEdit.name)

    if (currentEdit.value !== newValue) {
      if (currentEdit.name === 'displayName') await editDisplayName(newValue)
      if (currentEdit.name === 'email') await editEmail(newValue)
    }

    setCurrentEdit(currentEditInit)
  }

  const onClickEmailVerified = async (e) => {
    e.preventDefault()

    const { message, isSuccess } = await sendEmailVerification()
    if (isSuccess === true) {
      toast.default(message)
    } else {
      toast.error(message)
    }
  }

  const editDisplayName = async (newName) => {
    const { displayName, isSuccess, message } = await updateUserProfile({
      displayName: newName,
      photoURL: null,
    })

    // if (displayName) nameRef.current.value = displayName

    if (isSuccess === true) {
      toast.default(message)
    } else {
      toast.error(message)
    }
  }

  // TODO verifyBeforeUpdateEmail https://firebase.google.com/docs/reference/js/auth.md#verifybeforeupdateemail
  const editEmail = async (newEmail) => {
    const { email, isSuccess, message } = await updateUserEmail(newEmail)

    if (email) emailRef.current.value = newEmail

    if (isSuccess === true) {
      toast.default(message)
    } else {
      toast.error(message)
    }
  }

  useEffect(() => {
    setFormElement([
      {
        label: 'Nick Name',
        id: 'display-name',
        name: 'displayName',
        inputType: 'text',
        default: user.displayName || 'Guest',
        ref: nameRef,
        disabled: false,
      },
      {
        label: 'E-mail',
        id: 'email',
        name: 'email',
        inputType: 'email',
        default: user.email,
        isReadOnly: true,
        ref: emailRef,
        disabled: true,
      },
    ])
  }, [])

  return (
    <div className="space-y-16">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">My Account</h2>
        {/* <p className="text-gray-700">Your profile</p> */}
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <div className="w-full self-start sm:w-36">
            <label htmlFor="avatar">Profile photo</label>
          </div>
          <div className="flex flex-grow flex-col gap-2">
            <button
              className="relative h-24 w-24 overflow-hidden rounded-lg"
              onClick={uploadPhoto}
            >
              <span className="absolute left-0 top-0 z-20 h-full w-full bg-gray-800 opacity-0 transition-all hover:opacity-60">
                <div className="flex h-full flex-col items-center justify-center text-white">
                  <Icon className="h-6 w-6" icon="Pencil" />
                  <span>Random Photo</span>
                </div>
              </span>
              <img src={user.photoURL} alt="User photo" />
            </button>
            {user.randomPhoto && <p>You are using random photo now.</p>}
          </div>
        </div>
        <form onSubmit={onSubmit}>
          <ul className="space-y-4">
            {formElement.map((input) => {
              return (
                <FormItemContainer
                  key={input.id}
                  left={
                    <div className="w-full self-center sm:w-36">
                      <label htmlFor={input.id}>{input.label}</label>
                    </div>
                  }
                  right={
                    <>
                      <input
                        ref={input.ref}
                        type={input.type}
                        className="w-full py-2 px-4"
                        id={input.id}
                        name={input.name}
                        defaultValue={input.default}
                        readOnly={currentEdit.name !== input.name}
                      />
                      {currentEdit.name !== input.name ? (
                        input.disabled === false && (
                          <button
                            className="absolute left-0 top-0 flex h-full w-full items-center justify-end bg-gradient-to-l from-gray-200 px-4 text-gray-500 opacity-0 transition-opacity hover:opacity-100"
                            onClick={(e) => onClickEdit(e, input.name)}
                            type="button"
                          >
                            <span className="pointer-events-auto flex items-center gap-2">
                              <Icon icon="Pencil" />
                              <span>Edit</span>
                            </span>
                          </button>
                        )
                      ) : (
                        <button
                          className="bg-cyan-500 px-4 py-2 text-white"
                          type="submit"
                        >
                          Done
                        </button>
                      )}
                    </>
                  }
                />
              )
            })}
            <FormItemContainer
              left={<h3>E-mail Verified</h3>}
              right={
                <div className="flex items-center gap-8 pl-4">
                  <p className={clsx([!user.emailVerified && 'text-red-600'])}>
                    {user.emailVerified ? 'Done' : 'Not yet'}
                  </p>
                  {!user.emailVerified && (
                    <button
                      className="bg-cyan-500 px-4 py-2 text-white"
                      onClick={onClickEmailVerified}
                    >
                      Send a verification mail
                    </button>
                  )}
                </div>
              }
            />
          </ul>
        </form>
      </div>
    </div>
  )
}

function FormItemContainer({ left, right }) {
  return (
    <li className="flex flex-wrap gap-2">
      <div className="w-full self-center sm:w-36">{left}</div>
      <div className="relative flex flex-grow gap-4">{right}</div>
    </li>
  )
}

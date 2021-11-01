import React, { FunctionComponent, useState } from 'react'
import Link from 'next/link'
import CreateUserModal from 'components/modals/create-user-modal'
import { useUsers } from 'utils/swr-util'
import LoadingSpinner from 'components/loading-spinner'
import LoadingError from 'components/loading-error'

const Start: FunctionComponent = (): JSX.Element => {
  // STATE
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { users, isLoading, isError } = useUsers()

  // FUNCTIONS
  const openModal = () => {
    setShowCreateModal(true)
  }
  const closeModal = () => {
    setShowCreateModal(false)
  }

  if (isLoading) return <LoadingSpinner />
  if (isError) return <LoadingError />
  return (
    <div className="flex flex-col items-center align-top bg-gray-200 h-screen p-3 ">
      <p className="text-4xl mb-5">Welcome to Khipu</p>
      <div className="flex">
        <div className="">Select an existing user or&nbsp;</div>
        <button className="text-blue-500 underline" onClick={() => openModal()}>
          create a new user.
        </button>
      </div>
      <ul>
        {users.map((user, index) => {
          return (
            <li key={index}>
              <Link href={'/' + user.apiId}>
                <a className="grid items-center justify-center bg-blue-300 hover:bg-blue-200 cursor-pointer border border-gray-500 rounded shadow p-1 w-80 h-10 mt-2">
                  {user.username}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
      <CreateUserModal show={showCreateModal} closeModal={closeModal} />
    </div>
  )
}

export default Start

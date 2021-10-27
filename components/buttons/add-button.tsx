import { PlusIcon } from 'components/icons'
import React from 'react'

interface AddButtonProps {
  addFunction
}

const AddButton = ({ addFunction }: AddButtonProps): JSX.Element => {
  return (
    <button
      type="button"
      onClick={() => {
        addFunction()
      }}
      className="flex bg-transparent hover:bg-gray-100 text-gray-500 border border-gray-500 rounded w-8 h-8 items-center justify-center"
    >
      <div className="w-6 h-6">
        <PlusIcon />
      </div>
    </button>
  )
}

export default AddButton

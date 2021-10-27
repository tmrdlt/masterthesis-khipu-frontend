import React from 'react'

interface AddButtonProps {
  addString: string
  addFunction
}

const AddButton = ({ addString, addFunction }: AddButtonProps): JSX.Element => {
  return (
    <button
      type="button"
      onClick={() => {
        addFunction()
      }}
      className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Add {addString}
    </button>
  )
}

export default AddButton

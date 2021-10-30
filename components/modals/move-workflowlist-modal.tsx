import React from 'react'

interface MoveWorkflowListModalProps {
  closeModal
  selectWorkflowListToMove
}

const MoveWorkflowListModal = ({
  closeModal,
  selectWorkflowListToMove,
}: MoveWorkflowListModalProps): JSX.Element => {
  return (
    <div>
      <div className="fixed flex z-10 inset-0 min-h-screen w-screen bg-gray-500 opacity-75 overflow-y-auto" />
      <div className="absolute inset-0 flex justify-center">
        <button
          type="button"
          onClick={() => {
            closeModal()
            selectWorkflowListToMove(null)
          }}
          className="fixed z-40 mt-5 h-8 w-auto inline-flex items-center justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
        >
          Cancel moving
        </button>
      </div>
    </div>
  )
}

const MoveWorkflowListCoverElement = (): JSX.Element => {
    return (
        <div className="fixed z-30 inset-0 min-h-screen w-screen bg-transparent" />
    )
}

export default MoveWorkflowListModal
export {MoveWorkflowListCoverElement}

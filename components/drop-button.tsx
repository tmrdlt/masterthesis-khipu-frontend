import React from 'react'
import { WorkflowList } from 'utils/models'

interface IDropButtonProps {
  workflowList?: WorkflowList
  moveWorkflowList
  showDropButton
}

const DropButton = ({
  workflowList,
  moveWorkflowList,
  showDropButton,
}: IDropButtonProps): JSX.Element => {
  const showHideButton = showDropButton(workflowList) ? { display: 'block' } : { display: 'none' }
  return (
    <div style={showHideButton} className="z-20 relative transition-all">
      <button
        type="button"
        onClick={() => {
          moveWorkflowList(workflowList)
        }}
        className="flex items-center justify-center bg-green-400 hover:bg-green-600 text-gray-600 border border-gray-600 hover:border-transparent hover:text-white rounded mb-3 w-52 h-14"
      >
        <div className="w-8 h-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </div>
        <div> Drop here</div>
      </button>
    </div>
  )
}

export default DropButton

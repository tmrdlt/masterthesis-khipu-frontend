import React from 'react'
import { WorkflowList } from 'utils/models'

interface IDropButtonProps {
  workflowList?: WorkflowList
  moveWorkflowList
}

const DropButton = ({ workflowList, moveWorkflowList }: IDropButtonProps): JSX.Element => {
  return (
    <div className="z-40 relative transition-all">
        <div className="group min-w-min max-w-min">
            <div className="h-5 w-20 bg-transparent group-hover:bg-white group-hover:bg-opacity-20 text-gray-600 rounded-t border-l-2 border-r-2 border-dashed rounded border-t-2">

            </div>
            <button
                type="button"
                onClick={() => {
                    moveWorkflowList(workflowList)
                }}
                className="flex items-center bg-transparent group-hover:bg-white group-hover:bg-opacity-20 justify-center border border-dashed rounded border-2 text-white w-[20rem] h-[4rem]"
            >
                <div className="text-sm">
                    Move to {workflowList ? `"${workflowList.title}"` : 'root'}
                </div>
            </button>
        </div>

    </div>
  )
}

export default DropButton

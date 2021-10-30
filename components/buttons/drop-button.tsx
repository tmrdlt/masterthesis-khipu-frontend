import React from 'react'
import { WorkflowList } from 'utils/models'
import { DownloadIcon } from 'components/icons'
import { usePopperTooltip } from 'react-popper-tooltip'

interface IDropButtonProps {
  workflowList?: WorkflowList
  moveWorkflowList
}

const DropButton = ({ workflowList, moveWorkflowList }: IDropButtonProps): JSX.Element => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({placement: 'left'} )

  return (
    <div className="z-40 relative transition-all">
      <button
        type="button"
        onClick={() => {
          moveWorkflowList(workflowList)
        }}
        ref={setTriggerRef}
        className="flex items-center justify-center bg-green-400 hover:bg-green-600 text-gray-600 border border-gray-600 hover:border-white hover:text-white rounded w-10 h-8"
      >
        <div className="w-4 h-4">
          <DownloadIcon />
        </div>
      </button>
      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container text-xs'})}>
          <div {...getArrowProps({ className: 'tooltip-arrow'})} />
          Move to {workflowList ? workflowList.title : 'root'}
        </div>
      )}
    </div>
  )
}

export default DropButton

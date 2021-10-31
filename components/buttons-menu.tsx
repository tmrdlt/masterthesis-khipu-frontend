import { ConvertWorkflowListEntity, WorkflowList, WorkflowListType } from 'utils/models'
import React, { useState } from 'react'
import {
  ArrowsExpand,
  ClockIcon,
  PencilAltIcon,
  PlusIcon,
  SwitchHorizontalIcon,
  SwitchVerticalIcon,
  TrashIcon,
} from 'components/icons'
import {
  deleteWorkflowList,
  getWorkflowListsUrl,
  postWorkflowListConvert,
} from 'utils/workflow-api'
import { useSWRConfig } from 'swr'
import { usePopperTooltip } from 'react-popper-tooltip'
import DeleteWorkflowListModal from 'components/modals/delete-workflowlist-modal'

interface IButtonsMenuProps {
  userApiId: string
  workflowList: WorkflowList
  selectWorkflowListToMove
  openModifyModal
  openMoveModal
  openCreateModal?
  getTemporalQueryResult?
  isLoadingQuery?: boolean
  startLoading?
}

const ButtonsMenu = ({
  userApiId,
  workflowList,
  selectWorkflowListToMove,
  openCreateModal,
  openModifyModal,
  openMoveModal,
  getTemporalQueryResult,
  isLoadingQuery,
  startLoading,
}: IButtonsMenuProps): JSX.Element => {
  // STATE
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { mutate } = useSWRConfig()

  // FUNCTIONS
  const convertWorkflowList = (convertWorkflowListEntity: ConvertWorkflowListEntity) => {
    postWorkflowListConvert(workflowList.apiId, convertWorkflowListEntity, userApiId).then(
      (res) => {
        if (res) {
          mutate(getWorkflowListsUrl(userApiId))
        }
      }
    )
  }

  const deleteWorkflowListClick = () => {
    deleteWorkflowList(workflowList.apiId, userApiId).then((_res) => {
      mutate(getWorkflowListsUrl(userApiId))
    })
  }

  return (
    <div className="flex">
      <div className={'flex justify-center items-center h-8'}>
        {workflowList.usageType == WorkflowListType.BOARD &&
          workflowList.isTemporalConstraintBoard && (
            <TemporalQueryButton
              workflowList={workflowList}
              startLoading={startLoading}
              getTemporalQueryResult={getTemporalQueryResult}
              isLoadingQuery={isLoadingQuery}
            />
          )}
        {(workflowList.usageType == WorkflowListType.BOARD ||
          workflowList.usageType == WorkflowListType.LIST) && (
          <CreateWorkflowListButton openCreateModal={openCreateModal} />
        )}
        <MoveWorkflowListButton
          workflowList={workflowList}
          selectWorkflowListToMove={selectWorkflowListToMove}
          openMoveModal={openMoveModal}
        />
        <ModifyWorkflowListButton openModifyModal={openModifyModal} />
        {workflowList.usageType == WorkflowListType.BOARD && (
          <ConvertToListButton convertWorkflowList={convertWorkflowList} />
        )}
        {workflowList.usageType == WorkflowListType.LIST && (
          <ConvertToBoardButton convertWorkflowList={convertWorkflowList} />
        )}
        <DeleteWorkflowListButton setShowDeleteModal={setShowDeleteModal} />
      </div>
      {showDeleteModal && (
        <DeleteWorkflowListModal
          workflowList={workflowList}
          setShowDeleteModal={setShowDeleteModal}
          deleteWorkflowList={deleteWorkflowListClick}
        />
      )}
    </div>
  )
}

interface TemporalQueryButtonProps {
  workflowList: WorkflowList
  startLoading
  getTemporalQueryResult
  isLoadingQuery?: boolean
}

const TemporalQueryButton = ({
  workflowList,
  startLoading,
  getTemporalQueryResult,
  isLoadingQuery,
}: TemporalQueryButtonProps): JSX.Element => {
  // STATE
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip()

  // DYNAMIC CLASSES
  const animationSpinClassName = isLoadingQuery ? 'animate-spin' : ''

  const isDisabled =
    workflowList.children.filter((wl) => wl.usageType != WorkflowListType.ITEM).length <= 1

  return (
    <div>
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => {
          startLoading()
          getTemporalQueryResult(workflowList.apiId)
        }}
        ref={setTriggerRef}
        className="bg-transparent text-gray-600 hover:bg-gray-600 hover:text-white rounded p-1 w-6 h-6 disabled:opacity-50"
      >
        <div className={animationSpinClassName}>
          <ClockIcon />
        </div>
      </button>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: 'tooltip-container grid place-items-center text-xs' })}
        >
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          <span>Schedule board</span>
          {isDisabled && <span className="text-red-400">not enough sublists</span>}
          {isDisabled && <span className="text-red-400">(at least 2 needed)</span>}
        </div>
      )}
    </div>
  )
}
export default ButtonsMenu

interface CreateWorkflowListButtonProps {
  openCreateModal?
}

const CreateWorkflowListButton = ({
  openCreateModal,
}: CreateWorkflowListButtonProps): JSX.Element => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip()
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          openCreateModal()
        }}
        ref={setTriggerRef}
        className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded p-1 w-6 h-6"
      >
        <PlusIcon />
      </button>
      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container text-xs' })}>
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          Add
        </div>
      )}
    </div>
  )
}

interface MoveWorkflowListButtonProps {
  workflowList: WorkflowList
  selectWorkflowListToMove
  openMoveModal
}

const MoveWorkflowListButton = ({
  workflowList,
  selectWorkflowListToMove,
  openMoveModal,
}: MoveWorkflowListButtonProps): JSX.Element => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip()
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          selectWorkflowListToMove(workflowList)
          openMoveModal()
        }}
        ref={setTriggerRef}
        className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded p-1 w-6 h-6"
      >
        <div className="h-[14px] w-[14px]">
          <ArrowsExpand />
        </div>
      </button>
      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container text-xs' })}>
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          Move
        </div>
      )}
    </div>
  )
}

interface ModifyWorkflowListButtonProps {
  openModifyModal
}

const ModifyWorkflowListButton = ({
  openModifyModal,
}: ModifyWorkflowListButtonProps): JSX.Element => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip()
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          openModifyModal()
        }}
        ref={setTriggerRef}
        className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded p-1 w-6 h-6"
      >
        <PencilAltIcon />
      </button>
      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container text-xs' })}>
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          Modify
        </div>
      )}
    </div>
  )
}

interface ConvertToBoardButtonProps {
  convertWorkflowList
}

const ConvertToBoardButton = ({ convertWorkflowList }: ConvertToBoardButtonProps): JSX.Element => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip()
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          convertWorkflowList({ newListType: WorkflowListType.BOARD })
        }}
        ref={setTriggerRef}
        className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded p-1 w-6 h-6"
      >
        <SwitchHorizontalIcon />
      </button>
      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container text-xs' })}>
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          Convert to board
        </div>
      )}
    </div>
  )
}

interface ConvertToListButtonProps {
  convertWorkflowList
}

const ConvertToListButton = ({ convertWorkflowList }: ConvertToListButtonProps): JSX.Element => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip()
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          convertWorkflowList({ newListType: WorkflowListType.LIST })
        }}
        ref={setTriggerRef}
        className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded p-1 w-6 h-6"
      >
        <SwitchVerticalIcon />
      </button>
      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container text-xs' })}>
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          Convert to list
        </div>
      )}
    </div>
  )
}

interface DeleteWorkflowListButtonProps {
  setShowDeleteModal
}

const DeleteWorkflowListButton = ({
  setShowDeleteModal,
}: DeleteWorkflowListButtonProps): JSX.Element => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip()
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setShowDeleteModal(true)
        }}
        ref={setTriggerRef}
        className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded p-1 w-6 h-6"
      >
        <TrashIcon />
      </button>
      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container text-xs' })}>
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          Delete
        </div>
      )}
    </div>
  )
}

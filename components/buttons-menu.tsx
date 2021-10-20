import { ConvertWorkflowListEntity, WorkflowList, WorkflowListType } from 'utils/models'
import React from 'react'
import { Menu, MenuButton, MenuItem, MenuList } from '@reach/menu-button'
import '@reach/menu-button/styles.css'
import { ClockIcon, MenuIcon, PlusIcon, SelectorIcon } from 'components/icons'
import {
  deleteWorkflowList,
  getWorkflowListsUrl,
  postWorkflowListConvert,
} from 'utils/workflow-api'
import { useSWRConfig } from 'swr'
import { usePopperTooltip } from 'react-popper-tooltip'

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
  const { mutate } = useSWRConfig()

  // FUNCTIONS
  const convertWorkflowList = (
    uuid: string,
    convertWorkflowListEntity: ConvertWorkflowListEntity
  ) => {
    postWorkflowListConvert(uuid, convertWorkflowListEntity).then((res) => {
      if (res) {
        mutate(getWorkflowListsUrl(userApiId))
      }
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

        <Menu>
          <MenuButton className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded p-1 w-6 h-6">
            <MenuIcon />
          </MenuButton>
          <MenuList>
            <MenuItem
              onSelect={() => {
                openModifyModal()
              }}
            >
              Modify
            </MenuItem>
            {workflowList.usageType == WorkflowListType.BOARD && (
              <MenuItem
                onSelect={() => {
                  const cwle: ConvertWorkflowListEntity = { newListType: WorkflowListType.LIST }
                  convertWorkflowList(workflowList.apiId, cwle)
                }}
              >
                Convert to list
              </MenuItem>
            )}
            {workflowList.usageType == WorkflowListType.LIST && (
              <MenuItem
                onSelect={() => {
                  const cwle: ConvertWorkflowListEntity = { newListType: WorkflowListType.BOARD }
                  convertWorkflowList(workflowList.apiId, cwle)
                }}
              >
                Convert to board
              </MenuItem>
            )}
            <MenuItem
              onSelect={() => {
                deleteWorkflowList(workflowList.apiId).then((res) => {
                  mutate(getWorkflowListsUrl(userApiId))
                })
              }}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
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
        <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container grid place-items-center text-xs' })}>
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
          Create child
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
        <SelectorIcon />
      </button>
      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container text-xs' })}>
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          Move {workflowList.usageType.toLowerCase()}
        </div>
      )}
    </div>
  )
}

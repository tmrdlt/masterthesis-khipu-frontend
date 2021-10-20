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

  // DYNAMIC CLASSES
  const animationSpinClassName = isLoadingQuery ? 'animate-spin' : ''

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
            <button
              type="button"
              disabled={
                workflowList.children.filter((wl) => wl.usageType != WorkflowListType.ITEM)
                  .length <= 1
              }
              onClick={() => {
                startLoading()
                getTemporalQueryResult(workflowList.apiId)
              }}
              className="bg-transparent text-gray-600 hover:bg-gray-600 hover:text-white rounded p-1 w-6 h-6 disabled:opacity-50"
            >
              <div className={animationSpinClassName}>
                <ClockIcon />
              </div>
            </button>
          )}
        {(workflowList.usageType == WorkflowListType.BOARD ||
          workflowList.usageType == WorkflowListType.LIST) && (
          <button
            type="button"
            onClick={() => {
              openCreateModal()
            }}
            className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded p-1 w-6 h-6"
          >
            <PlusIcon />
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            selectWorkflowListToMove(workflowList)
            openMoveModal()
          }}
          className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded p-1 w-6 h-6"
        >
          <SelectorIcon />
        </button>
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

export default ButtonsMenu

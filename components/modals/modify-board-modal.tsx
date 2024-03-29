import React, { useState } from 'react'
import { UpdateWorkflowListEntity, WorkflowList } from 'utils/models'

import 'react-datepicker/dist/react-datepicker.css'
import { compareDateOptions } from 'utils/date-util'
import { getOptionalString } from 'utils/optional-util'
import {
  getWorkflowListsUrl,
  putWorkflowListResource,
  putWorkflowList,
} from 'utils/workflow-api'
import { useSWRConfig } from 'swr'
import { getInitWorkflowListResourceBoard } from 'utils/resource-util'
import ResourcesFormBoard from 'components/modals/resources-form-board'
import TextareaAutosize from 'react-textarea-autosize'
import { getRequiredClass } from 'utils/style-elements'

interface ModifyBoardModalProps {
  userApiId: string
  workflowList: WorkflowList
  closeModal
}

const ModifyBoardModal = ({
  userApiId,
  workflowList,
  closeModal,
}: ModifyBoardModalProps): JSX.Element => {
  // STATE
  const initUpdateBoardEntity: UpdateWorkflowListEntity = {
    newTitle: workflowList.title,
    newDescription: workflowList.description ? workflowList.description : '',
    isTemporalConstraintBoard: workflowList.isTemporalConstraintBoard,
  }
  const initResource = getInitWorkflowListResourceBoard(workflowList)

  const [updateBoardEntity, setUpdateBoardEntity] = useState(initUpdateBoardEntity)
  const [resource, setResource] = useState(initResource)

  const { mutate } = useSWRConfig()

  // FUNCTIONS
  const handleModifyBoardFormChange = (event) => {
    const newState = { ...updateBoardEntity, [event.target.id]: event.target.value }
    setUpdateBoardEntity(newState)
  }

  const handleToggleChange = () => {
    const newState = {
      ...updateBoardEntity,
      isTemporalConstraintBoard: !updateBoardEntity.isTemporalConstraintBoard,
    }
    setUpdateBoardEntity(newState)
  }

  const isWorkflowListUnchanged = (): boolean => {
    return (
      updateBoardEntity.newTitle === workflowList.title &&
      updateBoardEntity.newDescription === getOptionalString(workflowList.description) &&
      updateBoardEntity.isTemporalConstraintBoard == workflowList.isTemporalConstraintBoard
    )
  }

  const isTemporalResourceUnchanged = (): boolean => {
    return compareDateOptions(resource.temporal.dueDate, initResource.temporal.dueDate)
  }

  const isWorkflowListInvalid = (): boolean => {
    return updateBoardEntity.newTitle === ''
  }

  // https://tailwindcomponents.com/component/modal-1
  return (
    <div className="h-screen w-full overflow-auto fixed left-0 top-0 flex justify-center items-start bg-gray-500 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        {/* This div is taken from https://tailwindcss-forms.vercel.app/ simple --> */}
        <div className="m-5">
          <h3 className="font-bold">Modify Board</h3>
          <div className="mt-4 w-full text-sm">
            <div className="grid grid-cols-1 gap-5">
              <input
                type="text"
                className={`block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-300 focus:ring-opacity-50 ${getRequiredClass(
                  isWorkflowListInvalid()
                )}`}
                placeholder="Title (required)"
                value={updateBoardEntity.newTitle}
                onChange={handleModifyBoardFormChange}
                id="newTitle"
                autoFocus
              />
              <TextareaAutosize
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                minRows={3}
                placeholder="Description"
                value={updateBoardEntity.newDescription}
                onChange={handleModifyBoardFormChange}
                id="newDescription"
              />
              <div className="block">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    id="isTemporalConstraintBoard"
                    checked={
                      updateBoardEntity.isTemporalConstraintBoard
                        ? updateBoardEntity.isTemporalConstraintBoard
                        : false
                    }
                    onChange={handleToggleChange}
                  />
                  <span className="ml-2">Is temporal constraint board</span>
                </label>
              </div>
              <ResourcesFormBoard
                isTemporalConstraintBoard={updateBoardEntity.isTemporalConstraintBoard}
                resource={resource}
                setResource={setResource}
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            disabled={
              (isWorkflowListUnchanged() && isTemporalResourceUnchanged()) ||
              isWorkflowListInvalid()
            }
            onClick={() => {
              if (!isWorkflowListUnchanged()) {
                putWorkflowList(workflowList.apiId, updateBoardEntity, userApiId).then(
                  (_res) => {
                    mutate(getWorkflowListsUrl(userApiId))
                    closeModal()
                  }
                )
              }
              if (!isTemporalResourceUnchanged()) {
                putWorkflowListResource(workflowList.apiId, resource, userApiId).then((_res) => {
                  mutate(getWorkflowListsUrl(userApiId))
                  closeModal()
                })
              }
            }}
            className="disabled:opacity-50 disabled:cursor-not-allowed w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              closeModal()
            }}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModifyBoardModal

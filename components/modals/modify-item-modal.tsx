import React, { useState } from 'react'
import { UpdateWorkflowListEntity, WorkflowList, WorkflowListResource } from 'utils/models'
import 'react-datepicker/dist/react-datepicker.css'
import { compareDateOptions } from 'utils/date-util'
import { getOptionalNumber, getOptionalString } from 'utils/optional-util'
import 'react-tabs/style/react-tabs.css'
import { arraysEqual } from 'utils/compare-util'
import {
  getWorkflowListsUrl,
  putWorkflowListResource,
  putWorkflowList,
} from 'utils/workflow-api'
import { useSWRConfig } from 'swr'
import ResourcesFormItem from 'components/modals/resources-form-item'
import { getInitWorkflowListResource } from 'utils/resource-util'
import TextareaAutosize from 'react-textarea-autosize'
import { getRequiredClass } from 'utils/style-elements'

interface ModifyItemModalProps {
  userApiId: string
  workflowList: WorkflowList
  closeModal
}

const ModifyItemModal = ({
  userApiId,
  workflowList,
  closeModal,
}: ModifyItemModalProps): JSX.Element => {
  // STATE
  const initUpdateItemEntity: UpdateWorkflowListEntity = {
    newTitle: workflowList.title,
    newDescription: getOptionalString(workflowList.description),
    isTemporalConstraintBoard: workflowList.isTemporalConstraintBoard,
  }
  const initResource = getInitWorkflowListResource(workflowList)

  const [updateItemEntity, setUpdateItemEntity] = useState(initUpdateItemEntity)
  const [resource, setResource] = useState(initResource)

  const { mutate } = useSWRConfig()

  // FUNCTIONS
  const handleUpdateItemFormChange = (event) => {
    const newState = { ...updateItemEntity, [event.target.id]: event.target.value }
    setUpdateItemEntity(newState)
  }

  const isWorkflowListUnchanged = (): boolean => {
    return (
      updateItemEntity.newTitle == initUpdateItemEntity.newTitle &&
      updateItemEntity.newDescription == initUpdateItemEntity.newDescription
    )
  }

  const isTemporalResourceUnchanged = (): boolean => {
    return (
      compareDateOptions(resource.temporal.startDate, initResource.temporal.startDate) &&
      compareDateOptions(resource.temporal.dueDate, initResource.temporal.dueDate) &&
      resource.temporal.durationInMinutes ==
        getOptionalNumber(initResource.temporal.durationInMinutes)
    )
  }

  const areNumericResourcesUnchanged = (): boolean => {
    return arraysEqual(resource.numeric, initResource.numeric)
  }

  const areTextualResourcesUnchanged = (): boolean => {
    return arraysEqual(resource.textual, initResource.textual)
  }

  const isUserResourceUnchanged = (): boolean => {
    return resource.user.username === initResource.user.username
  }

  const isWorkflowListInvalid = (): boolean => {
    return updateItemEntity.newTitle === ''
  }

  const isNumericResourceFormInvalid = (): boolean => {
    // @ts-ignore
    return resource.numeric.filter((nr) => nr.label === '' || nr.value === '').length !== 0
  }

  const isTextualResourceFormInvalid = (): boolean => {
    // @ts-ignore
    return resource.textual.filter((tr) => tr.label === '').length !== 0
  }

  // https://tailwindcomponents.com/component/modal-1
  return (
    <div className="h-screen w-full overflow-auto fixed left-0 top-0 flex justify-center items-start bg-gray-500 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        {/* This div is taken from https://tailwindcss-forms.vercel.app/ simple --> */}
        <form>
          <div className="m-5">
            <h3 className="font-bold">Modify Item</h3>
            <div className="mt-4 w-full text-sm">
              <div className="grid grid-cols-1 gap-5">
                <input
                  type="text"
                  className={`block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-300 focus:ring-opacity-50 ${getRequiredClass(
                    isWorkflowListInvalid()
                  )}`}
                  placeholder="Title (required)"
                  value={updateItemEntity.newTitle}
                  onChange={handleUpdateItemFormChange}
                  id="newTitle"
                  autoFocus
                />
                <TextareaAutosize
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                  minRows={3}
                  placeholder="Description"
                  value={updateItemEntity.newDescription}
                  onChange={handleUpdateItemFormChange}
                  id="newDescription"
                />
                <ResourcesFormItem resource={resource} setResource={setResource} />
              </div>
            </div>
          </div>
          <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
              type="button"
              disabled={
                (isWorkflowListUnchanged() &&
                  isTemporalResourceUnchanged() &&
                  areNumericResourcesUnchanged() &&
                  areTextualResourcesUnchanged() &&
                  isUserResourceUnchanged()) ||
                isWorkflowListInvalid() ||
                isNumericResourceFormInvalid() ||
                isTextualResourceFormInvalid()
              }
              onClick={() => {
                if (!isWorkflowListUnchanged()) {
                  putWorkflowList(workflowList.apiId, updateItemEntity, userApiId).then(
                    (_res) => {
                      mutate(getWorkflowListsUrl(userApiId))
                      closeModal()
                    }
                  )
                }
                const entity: WorkflowListResource = {
                  numeric: areNumericResourcesUnchanged() ? null : resource.numeric,
                  textual: areTextualResourcesUnchanged() ? null : resource.textual,
                  temporal: isTemporalResourceUnchanged()
                    ? null
                    : {
                        ...resource.temporal,
                        durationInMinutes:
                          resource.temporal.durationInMinutes === 0
                            ? null
                            : resource.temporal.durationInMinutes,
                      },
                  user: isUserResourceUnchanged()
                    ? null
                    : resource.user.username === ''
                    ? {
                        username: null,
                      }
                    : resource.user,
                }
                putWorkflowListResource(workflowList.apiId, entity, userApiId).then((_res) => {
                  mutate(getWorkflowListsUrl(userApiId))
                  closeModal()
                })
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
        </form>
      </div>
    </div>
  )
}

export default ModifyItemModal

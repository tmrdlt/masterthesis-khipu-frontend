import React, { useState } from 'react'
import {
  NumericResource,
  TemporalResource,
  TextualResource,
  UpdateWorkflowListEntity,
  UserResource,
  WorkflowList,
  WorkflowListResource,
} from 'utils/models'
import 'react-datepicker/dist/react-datepicker.css'
import { compareDateOptions } from 'utils/date-util'
import { getOptionalNumber, getOptionalString } from 'utils/optional-util'
import 'react-tabs/style/react-tabs.css'
import { arraysEqual } from 'utils/compare-util'
import {
  getWorkflowListsUrl,
  postWorkflowListResource,
  updateWorkflowList,
} from 'utils/workflow-api'
import { useSWRConfig } from 'swr'
import ItemResourcesForm from 'components/modals/item-resources-form'

interface ModifyItemModalProps {
  userApiId: string
  workflowList: WorkflowList
  isInsideTemporalConstraintBoard: boolean
  closeModal
}

const ModifyItemModal = ({
  userApiId,
  workflowList,
  isInsideTemporalConstraintBoard,
  closeModal,
}: ModifyItemModalProps): JSX.Element => {
  // STATE
  const initUpdateItemEntity: UpdateWorkflowListEntity = {
    newTitle: workflowList.title,
    newDescription: getOptionalString(workflowList.description),
    isTemporalConstraintBoard: workflowList.isTemporalConstraintBoard,
  }
  const initTemporalResource: TemporalResource = workflowList.temporalResource
    ? {
        startDate: workflowList.temporalResource.startDate,
        endDate: workflowList.temporalResource.endDate,
        durationInMinutes: getOptionalNumber(workflowList.temporalResource.durationInMinutes),
      }
    : {
        startDate: null,
        endDate: null,
        durationInMinutes: 0,
      }
  const initNumericResources = workflowList.numericResources
  const initTextualResources = workflowList.textualResources
  const initUserResource = workflowList.userResource
    ? {
        username: getOptionalString(workflowList.userResource.username),
      }
    : {
        username: '',
      }

  const [updateItemEntity, setUpdateItemEntity] = useState(initUpdateItemEntity)
  const [temporalResource, setTemporalResource] = useState(initTemporalResource)
  const [numericResources, setNumericResources] = useState(initNumericResources)
  const [textualResources, setTextualResources] = useState(initTextualResources)
  const [userResource, setUserResource] = useState(initUserResource)
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
      compareDateOptions(temporalResource.startDate, initTemporalResource.startDate) &&
      compareDateOptions(temporalResource.endDate, initTemporalResource.endDate) &&
      temporalResource.durationInMinutes ==
        getOptionalNumber(initTemporalResource.durationInMinutes)
    )
  }

  const areNumericResourcesUnchanged = (): boolean => {
    return arraysEqual(numericResources, initNumericResources)
  }

  const areTextualResourcesUnchanged = (): boolean => {
    return arraysEqual(textualResources, initTextualResources)
  }

  const isUserResourceUnchanged = (): boolean => {
    return userResource.username === initUserResource.username
  }

  const isNumericResourceFormInvalid = (): boolean => {
    // @ts-ignore
    return numericResources.filter((nr) => nr.label === '' || nr.value === '').length !== 0
  }

  const isTextualResourceFormInvalid = (): boolean => {
    // @ts-ignore
    return textualResources.filter((tr) => tr.label === '').length !== 0
  }

  return (
    <div>
      {/* https://tailwindcomponents.com/component/modal-1 */}
      <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-gray-500 bg-opacity-75">
        <div className="bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* This div is taken from https://tailwindcss-forms.vercel.app/ simple --> */}
          <form>
            <div className="m-5">
              <h3 className="font-bold">Modify Item</h3>
              <div className="mt-4 w-full">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <label className="block">
                    <span className="text-gray-700">Title</span>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                      value={updateItemEntity.newTitle}
                      onChange={handleUpdateItemFormChange}
                      id="newTitle"
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Description</span>
                    <textarea
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                      rows={3}
                      value={updateItemEntity.newDescription}
                      onChange={handleUpdateItemFormChange}
                      id="newDescription"
                    />
                  </label>
                  <span className="text-gray-700">Resources</span>
                  <ItemResourcesForm
                    isInsideTemporalConstraintBoard={isInsideTemporalConstraintBoard}
                    temporalResource={temporalResource}
                    numericResources={numericResources}
                    textualResources={textualResources}
                    userResource={userResource}
                    setTemporalResource={setTemporalResource}
                    setNumericResources={setNumericResources}
                    setTextualResources={setTextualResources}
                    setUserResource={setUserResource}
                  />
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
                  isNumericResourceFormInvalid() ||
                  isTextualResourceFormInvalid()
                }
                onClick={() => {
                  let numericEntity: Array<NumericResource> = null
                  let textualEntity: Array<TextualResource> = null
                  let temporalEntity: TemporalResource = null
                  let userEntity: UserResource = null
                  if (!isWorkflowListUnchanged()) {
                    updateWorkflowList(workflowList.apiId, updateItemEntity).then((_res) => {
                      mutate(getWorkflowListsUrl(userApiId))
                      closeModal()
                    })
                  }
                  if (!isTemporalResourceUnchanged()) {
                    // @ts-ignore
                    temporalEntity = {
                      ...temporalResource,
                      durationInMinutes:
                        temporalResource.durationInMinutes === 0
                          ? null
                          : temporalResource.durationInMinutes,
                    }
                  }
                  if (!areNumericResourcesUnchanged() && !isNumericResourceFormInvalid()) {
                    numericEntity = numericResources
                  }
                  if (!areTextualResourcesUnchanged() && !isTextualResourceFormInvalid()) {
                    textualEntity = textualResources
                  }
                  if (!isUserResourceUnchanged()) {
                    if (userResource.username === '') {
                      userEntity = {
                        username: null,
                      }
                    } else {
                      userEntity = userResource
                    }
                  }
                  const entity: WorkflowListResource = {
                    numeric: numericEntity,
                    textual: textualEntity,
                    temporal: temporalEntity,
                    user: userEntity,
                  }
                  postWorkflowListResource(workflowList.apiId, entity).then((_res) => {
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
    </div>
  )
}

export default ModifyItemModal

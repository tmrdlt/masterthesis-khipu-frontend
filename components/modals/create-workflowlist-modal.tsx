import React, { useState } from 'react'
import {
  CreateWorkflowListEntity,
  NumericResource,
  TemporalResource,
  TextualResource,
  UserResource,
  WorkflowListResource,
  WorkflowListType,
} from 'utils/models'
import {
  createWorkflowList,
  getWorkflowListsUrl,
  postWorkflowListResource,
} from 'utils/workflow-api'
import { useSWRConfig } from 'swr'
import ItemResourcesForm from 'components/modals/item-resources-form'
import { compareDateOptions } from 'utils/date-util'
import { getOptionalNumber } from 'utils/optional-util'
import { arraysEqual } from 'utils/compare-util'

interface CreateWorkflowListModalProps {
  closeModal
  createType: WorkflowListType
  parentUuid: string
  userApiId: string
}

const CreateWorkflowListModal = ({
  closeModal,
  createType,
  parentUuid,
  userApiId,
}: CreateWorkflowListModalProps): JSX.Element => {
  // STATE
  const initCreateWorkflowListEntity: CreateWorkflowListEntity = {
    title: '',
    listType: createType,
    parentApiId: parentUuid,
    description: '',
    userApiId: userApiId,
  }
  const initTemporalResource: TemporalResource = {
    startDate: null,
    endDate: null,
    durationInMinutes: 0,
  }
  const initNumericResources: Array<NumericResource> = []
  const initTextualResources: Array<TextualResource> = []
  const initUserResource: UserResource = {
    username: '',
  }
  const [createWorkflowListEntity, setCreateWorkflowListEntity] = useState(
    initCreateWorkflowListEntity
  )
  const [temporalResource, setTemporalResource] = useState(initTemporalResource)
  const [numericResources, setNumericResources] = useState(initNumericResources)
  const [textualResources, setTextualResources] = useState(initTextualResources)
  const [userResource, setUserResource] = useState(initUserResource)
  const { mutate } = useSWRConfig()

  // FUNCTIONS
  const handleCreateWorkflowListEntityFormChange = (event) => {
    const newState = { ...createWorkflowListEntity, [event.target.id]: event.target.value }
    setCreateWorkflowListEntity(newState)
  }

  const isWorkflowListUnchanged = (): boolean => {
    return createWorkflowListEntity.title == initCreateWorkflowListEntity.title
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
          <div className="m-5">
            <h3 className="font-bold">Create a...</h3>
            <div className="mt-4 w-full text-sm">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center">
                  <label className="inline-flex items-center mr-3">
                    <input
                      type="radio"
                      value={WorkflowListType.BOARD}
                      id="listType"
                      checked={createWorkflowListEntity.listType === WorkflowListType.BOARD}
                      onChange={handleCreateWorkflowListEntityFormChange}
                      className="h-4 w-4"
                    />
                    <span className="ml-1">Board</span>
                  </label>
                  <label className="inline-flex items-center mr-3">
                    <input
                      type="radio"
                      value={WorkflowListType.LIST}
                      id="listType"
                      checked={createWorkflowListEntity.listType === WorkflowListType.LIST}
                      onChange={handleCreateWorkflowListEntityFormChange}
                      className="h-4 w-4"
                    />
                    <span className="ml-1">List</span>
                  </label>
                  <label className="inline-flex items-center mr-3">
                    <input
                      type="radio"
                      value={WorkflowListType.ITEM}
                      id="listType"
                      checked={createWorkflowListEntity.listType === WorkflowListType.ITEM}
                      onChange={handleCreateWorkflowListEntityFormChange}
                      className="h-4 w-4"
                    />
                    <span className="ml-1">Item</span>
                  </label>
                </div>
                <label className="block">
                  <span className="text-gray-700">Title</span>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                    value={createWorkflowListEntity.title}
                    onChange={handleCreateWorkflowListEntityFormChange}
                    id="title"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Description</span>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                    rows={3}
                    value={createWorkflowListEntity.description}
                    onChange={handleCreateWorkflowListEntityFormChange}
                    id="description"
                  />
                </label>
                {createWorkflowListEntity.listType == WorkflowListType.ITEM && (
                  <ItemResourcesForm
                    temporalResource={temporalResource}
                    numericResources={numericResources}
                    textualResources={textualResources}
                    userResource={userResource}
                    setTemporalResource={setTemporalResource}
                    setNumericResources={setNumericResources}
                    setTextualResources={setTextualResources}
                    setUserResource={setUserResource}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
              type="button"
              disabled={
                isWorkflowListUnchanged() ||
                (createWorkflowListEntity.listType == WorkflowListType.ITEM &&
                  isWorkflowListUnchanged() &&
                  isTemporalResourceUnchanged() &&
                  areNumericResourcesUnchanged() &&
                  areTextualResourcesUnchanged() &&
                  isUserResourceUnchanged()) ||
                isNumericResourceFormInvalid() ||
                isTextualResourceFormInvalid()
              }
              onClick={() => {
                createWorkflowList(createWorkflowListEntity).then((res) => {
                  if (res && createWorkflowListEntity.listType == WorkflowListType.ITEM) {
                    let apiId = res
                    let numericEntity: Array<NumericResource> = null
                    let textualEntity: Array<TextualResource> = null
                    let temporalEntity: TemporalResource = null
                    let userEntity: UserResource = null
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
                    postWorkflowListResource(apiId, entity).then((_res) => {
                      mutate(getWorkflowListsUrl(userApiId))
                      closeModal()
                    })
                  } else {
                    mutate(getWorkflowListsUrl(userApiId))
                    closeModal()
                  }
                })
              }}
              className="disabled:opacity-50 disabled:cursor-not-allowed w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Create
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
    </div>
  )
}

export default CreateWorkflowListModal

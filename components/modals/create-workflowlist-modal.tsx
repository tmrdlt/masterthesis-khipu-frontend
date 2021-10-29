import React, { useState } from 'react'
import { CreateWorkflowListEntity, WorkflowListResource, WorkflowListType } from 'utils/models'
import {
  createWorkflowList,
  getWorkflowListsUrl,
  postWorkflowListResource,
} from 'utils/workflow-api'
import { useSWRConfig } from 'swr'
import ResourcesFormItem from 'components/modals/resources-form-item'
import { compareDateOptions } from 'utils/date-util'
import { getOptionalNumber } from 'utils/optional-util'
import { arraysEqual } from 'utils/compare-util'
import { getInitWorkflowListResource } from 'utils/resource-util'
import ResourcesFormBoard from 'components/modals/resources-form-board'
import CreateChildrenForm from 'components/modals/create-children-form'
import { getLowerWorkflowListType } from 'utils/models-util'
import TextareaAutosize from 'react-textarea-autosize'

interface CreateWorkflowListModalProps {
  closeModal
  defaultCreateType: WorkflowListType
  parentUuid: string
  userApiId: string
}

const CreateWorkflowListModal = ({
  closeModal,
  defaultCreateType,
  parentUuid,
  userApiId,
}: CreateWorkflowListModalProps): JSX.Element => {
  // STATE
  const initCreateWorkflowListEntity: CreateWorkflowListEntity = {
    title: '',
    listType: defaultCreateType,
    parentApiId: parentUuid,
    description: '',
    isTemporalConstraintBoard: false,
  }
  const initResource = getInitWorkflowListResource()

  const [createWorkflowListEntity, setCreateWorkflowListEntity] = useState(
    initCreateWorkflowListEntity
  )
  const [resource, setResource] = useState(initResource)
  const initCreateChildren: Array<CreateWorkflowListEntity> = []
  const [createChildren, setCreateChildren] = useState(initCreateChildren)
  const { mutate } = useSWRConfig()

  // FUNCTIONS
  const handleCreateWorkflowListEntityFormChange = (event) => {
    const newState = { ...createWorkflowListEntity, [event.target.id]: event.target.value }
    setCreateWorkflowListEntity(newState)
    // Reset state on toggle change
    if (event.target.id === "listType") {
      setResource(initResource)
      if (event.target.value === WorkflowListType.ITEM) {
        setCreateChildren(initCreateChildren)
      }
    }
  }

  const handleToggleChange = () => {
    const newState = {
      ...createWorkflowListEntity,
      isTemporalConstraintBoard: !createWorkflowListEntity.isTemporalConstraintBoard,
    }
    setCreateWorkflowListEntity(newState)
  }

  const isWorkflowListUnchanged = (): boolean => {
    return createWorkflowListEntity.title == initCreateWorkflowListEntity.title
  }

  const isTemporalResourceUnchanged = (): boolean => {
    return (
      compareDateOptions(resource.temporal.startDate, initResource.temporal.startDate) &&
      compareDateOptions(resource.temporal.endDate, initResource.temporal.endDate) &&
      initResource.temporal.durationInMinutes ==
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

  const isNumericResourceFormInvalid = (): boolean => {
    // @ts-ignore
    return resource.numeric.filter((nr) => nr.label === '' || nr.value === '').length !== 0
  }

  const isTextualResourceFormInvalid = (): boolean => {
    // @ts-ignore
    return resource.textual.filter((tr) => tr.label === '').length !== 0
  }

  const isChildrenFormInvalid = (): boolean => {
    return createChildren.filter((cwe) => cwe.title === '').length !== 0
  }

  const addKanbanBoardColumns = () => {
    let newState = [...createChildren]
    newState.push({
      title: 'ToDo',
      listType: WorkflowListType.LIST,
      parentApiId: null,
      description: '',
      isTemporalConstraintBoard: false,
    })
    newState.push({
      title: 'Doing',
      listType: WorkflowListType.LIST,
      parentApiId: null,
      description: '',
      isTemporalConstraintBoard: false,
    })
    newState.push({
      title: 'Done',
      listType: WorkflowListType.LIST,
      parentApiId: null,
      description: '',
      isTemporalConstraintBoard: false,
    })
    setCreateChildren(newState)
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
              <div className="grid grid-cols-1 gap-5">
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
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                  placeholder="Title (required)"
                  value={createWorkflowListEntity.title}
                  onChange={handleCreateWorkflowListEntityFormChange}
                  id="title"
                />
                <TextareaAutosize
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                  minRows={3}
                  placeholder="Description"
                  value={createWorkflowListEntity.description}
                  onChange={handleCreateWorkflowListEntityFormChange}
                  id="description"
                />
                {createWorkflowListEntity.listType == WorkflowListType.BOARD && (
                  <button
                    type="button"
                    onClick={() => {
                      addKanbanBoardColumns()
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                    Make Kanban Board
                  </button>
                )}
                {(createWorkflowListEntity.listType == WorkflowListType.BOARD ||
                  createWorkflowListEntity.listType == WorkflowListType.LIST) && (
                  <CreateChildrenForm
                    defaultCreateType={getLowerWorkflowListType(createWorkflowListEntity.listType)}
                    createChildren={createChildren}
                    setCreateChildren={setCreateChildren}
                  />
                )}
                {createWorkflowListEntity.listType == WorkflowListType.BOARD && (
                  <div className="block">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        id="isTemporalConstraintBoard"
                        checked={createWorkflowListEntity.isTemporalConstraintBoard}
                        onChange={handleToggleChange}
                      />
                      <span className="ml-2">Is temporal constraint board</span>
                    </label>
                  </div>
                )}
                {createWorkflowListEntity.listType == WorkflowListType.BOARD && (
                  <ResourcesFormBoard
                    isTemporalConstraintBoard={createWorkflowListEntity.isTemporalConstraintBoard}
                    resource={resource}
                    setResource={setResource}
                  />
                )}
                {createWorkflowListEntity.listType == WorkflowListType.ITEM && (
                  <ResourcesFormItem resource={resource} setResource={setResource} />
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
                isTextualResourceFormInvalid() ||
                isChildrenFormInvalid()
              }
              onClick={() => {
                createWorkflowList(createWorkflowListEntity, userApiId).then((apiId) => {
                  if (apiId && createChildren.length != 0) {
                    Promise.all(
                      createChildren.map((child) => {
                        createWorkflowList({ ...child, parentApiId: apiId }, userApiId)
                      })
                    ).then((_res) => {
                      mutate(getWorkflowListsUrl(userApiId))
                      closeModal()
                    })
                  }
                  if (
                    apiId &&
                    (createWorkflowListEntity.listType == WorkflowListType.ITEM ||
                      createWorkflowListEntity.listType == WorkflowListType.BOARD)
                  ) {
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
                    postWorkflowListResource(apiId, entity, userApiId).then((_res) => {
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

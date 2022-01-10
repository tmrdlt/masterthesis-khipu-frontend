import React, { useState } from 'react'
import { CreateWorkflowListEntity, WorkflowListResource, WorkflowListType } from 'utils/models'
import {
  postWorkflowList,
  getWorkflowListsUrl,
  putWorkflowListResource,
} from 'utils/workflow-api'
import { useSWRConfig } from 'swr'
import ResourcesFormItem from 'components/modals/resources-form-item'
import { compareDateOptions } from 'utils/date-util'
import { getOptionalNumber } from 'utils/optional-util'
import { arraysEqual } from 'utils/compare-util'
import { getInitWorkflowListResource } from 'utils/resource-util'
import ResourcesFormBoard from 'components/modals/resources-form-board'
import CreateChildrenForm from 'components/modals/create-children-form'
import TextareaAutosize from 'react-textarea-autosize'
import CreateTitleAndTypeForm from 'components/modals/create-title-and-type-form'
import Collapsible from 'react-collapsible'
import Trigger, { TriggerWhenOpen } from 'components/modals/collapsible-trigger'
import produce from 'immer'

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
  const initCreateChildren: Array<CreateWorkflowListEntity> = []
  const initCreateWorkflowListEntity: CreateWorkflowListEntity = {
    title: '',
    listType: defaultCreateType,
    parentApiId: parentUuid,
    description: '',
    isTemporalConstraintBoard: false,
    children: initCreateChildren,
  }
  const initResource = getInitWorkflowListResource()

  const [createWorkflowListEntity, setCreateWorkflowListEntity] = useState(
    initCreateWorkflowListEntity
  )
  const [resource, setResource] = useState(initResource)
  const { mutate } = useSWRConfig()
  // FUNCTIONS
  const setCreateChildren = (children: Array<CreateWorkflowListEntity>) => {
    const newState = produce(createWorkflowListEntity, (draft) => {draft.children = children})
    setCreateWorkflowListEntity(newState)
  }
  const handleCreateWorkflowListEntityFormChange = (event) => {
    let newState =
      event.target.value === WorkflowListType.ITEM
        ? produce(createWorkflowListEntity, (draft) => {
            draft[event.target.id] = event.target.value
            draft.children = initCreateChildren
          })
        : produce(createWorkflowListEntity, (draft) => {
            draft[event.target.id] = event.target.value
          })
    setCreateWorkflowListEntity(newState)
    // Reset state on toggle change
    if (event.target.id === 'listType') {
      setResource(initResource)
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

  const isNumericResourceFormInvalid = (): boolean => {
    // @ts-ignore
    return resource.numeric.filter((nr) => nr.label === '' || nr.value === '').length !== 0
  }

  const isTextualResourceFormInvalid = (): boolean => {
    // @ts-ignore
    return resource.textual.filter((tr) => tr.label === '').length !== 0
  }

  const isChildrenFormInvalid = (): boolean => {
    return createWorkflowListEntity.children.filter((cwe) => cwe.title === '').length !== 0
  }

  // https://tailwindcomponents.com/component/modal-1
  return (
    <div className="h-screen w-full overflow-auto fixed left-0 top-0 flex justify-center items-start bg-gray-500 bg-opacity-75">
      <div className="flex flex-col justify-between bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        {/* This div is taken from https://tailwindcss-forms.vercel.app/ simple --> */}
        <div className="m-5">
          <h3 className="font-bold">New element</h3>
          <div className="mt-4 w-full text-sm">
            <div className="grid grid-cols-1 gap-5">
              <CreateTitleAndTypeForm
                index={0}
                createEntity={createWorkflowListEntity}
                handleFormChange={handleCreateWorkflowListEntityFormChange}
              />
              <Collapsible
                open={true}
                trigger={Trigger({ text: 'Details' })}
                transitionTime={100}
                transitionCloseTime={100}
                triggerWhenOpen={TriggerWhenOpen({ text: 'Details' })}
              >
                <div className="mr-5 ml-5 mt-2 grid grid-cols-1 gap-5">
                  <TextareaAutosize
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                    minRows={3}
                    placeholder="Description"
                    value={createWorkflowListEntity.description}
                    onChange={handleCreateWorkflowListEntityFormChange}
                    id="description"
                  />
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
              </Collapsible>
              {(createWorkflowListEntity.listType == WorkflowListType.BOARD ||
                createWorkflowListEntity.listType == WorkflowListType.LIST) && (
                <Collapsible
                  open={true}
                  trigger={Trigger({ text: 'Children' })}
                  transitionTime={100}
                  transitionCloseTime={100}
                  triggerWhenOpen={TriggerWhenOpen({ text: 'Children' })}
                >
                  <div className="mr-5 ml-5 mt-2">
                    <CreateChildrenForm
                      parentType={createWorkflowListEntity.listType}
                      createChildren={createWorkflowListEntity.children}
                      setCreateChildren={setCreateChildren}
                    />
                  </div>
                </Collapsible>
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
              postWorkflowList(createWorkflowListEntity, userApiId).then((apiId) => {
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
                  putWorkflowListResource(apiId, entity, userApiId).then((_res) => {
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
  )
}

export default CreateWorkflowListModal

import React, { useState } from 'react'
import { CreateWorkflowListEntity, WorkflowListType } from 'utils/models'
import { getWorkflowLists, postWorkflowList } from 'utils/workflow-api'
import { useSWRConfig } from 'swr'

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
  const [state, setState] = useState(initCreateWorkflowListEntity)
  const { mutate } = useSWRConfig()

  // FUNCTIONS
  const handleFormChange = (event) => {
    const newState = { ...state, [event.target.id]: event.target.value }
    setState(newState)
  }

  const createWorkflowList = async (createWorkflowListEntity: CreateWorkflowListEntity) => {
    let newCreateWorkflowListEntity: CreateWorkflowListEntity
    if (createWorkflowListEntity.description == '') {
      newCreateWorkflowListEntity = { ...createWorkflowListEntity, description: null }
    } else {
      newCreateWorkflowListEntity = createWorkflowListEntity
    }
    postWorkflowList(newCreateWorkflowListEntity).then((res) => {
      if (res) {
        mutate(getWorkflowLists(userApiId))
      }
      return res
    })
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
                      checked={state.listType === WorkflowListType.BOARD}
                      onChange={handleFormChange}
                      className="h-4 w-4"
                    />
                    <span className="ml-1">Board</span>
                  </label>
                  <label className="inline-flex items-center mr-3">
                    <input
                      type="radio"
                      value={WorkflowListType.LIST}
                      id="listType"
                      checked={state.listType === WorkflowListType.LIST}
                      onChange={handleFormChange}
                      className="h-4 w-4"
                    />
                    <span className="ml-1">List</span>
                  </label>
                  <label className="inline-flex items-center mr-3">
                    <input
                      type="radio"
                      value={WorkflowListType.ITEM}
                      id="listType"
                      checked={state.listType === WorkflowListType.ITEM}
                      onChange={handleFormChange}
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
                    value={state.title}
                    onChange={handleFormChange}
                    id="title"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Description</span>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                    rows={3}
                    value={state.description}
                    onChange={handleFormChange}
                    id="description"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
              type="button"
              disabled={state.title === ''}
              onClick={() => {
                createWorkflowList(state).then((_res) => {
                  closeModal()
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

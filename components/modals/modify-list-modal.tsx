import React, { useState } from 'react'
import { UpdateWorkflowListEntity, WorkflowList } from 'utils/models'

import 'react-datepicker/dist/react-datepicker.css'
import { getOptionalString } from 'utils/optional-util'
import { useSWRConfig } from 'swr'
import { getWorkflowListsUrl, updateWorkflowList } from 'utils/workflow-api'

interface ModifyListModalProps {
  userApiId: string
  workflowList: WorkflowList
  closeModal
}

const ModifyListModal = ({
  userApiId,
  workflowList,
  closeModal,
}: ModifyListModalProps): JSX.Element => {
  // STATE
  const initUpdateWorkflowListEntity: UpdateWorkflowListEntity = {
    newTitle: workflowList.title,
    newDescription: workflowList.description ? workflowList.description : '',
    isTemporalConstraintBoard: workflowList.isTemporalConstraintBoard,
  }
  const [state, setState] = useState(initUpdateWorkflowListEntity)
  const { mutate } = useSWRConfig()

  // FUNCTIONS
  const handleFormChange = (event) => {
    const newState = { ...state, [event.target.id]: event.target.value }
    setState(newState)
  }

  return (
    <div>
      {/* https://tailwindcomponents.com/component/modal-1 */}
      <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-gray-500 bg-opacity-75">
        <div className="bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* This div is taken from https://tailwindcss-forms.vercel.app/ simple --> */}
          <div className="m-5">
            <h3 className="font-bold">Modify List</h3>
            <div className="mt-4 w-full">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                  placeholder="Title (required)"
                  value={state.newTitle}
                  onChange={handleFormChange}
                  id="newTitle"
                />
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                  rows={3}
                  placeholder="Description"
                  value={state.newDescription}
                  onChange={handleFormChange}
                  id="newDescription"
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
              type="button"
              disabled={
                state.newTitle === workflowList.title &&
                state.newDescription === getOptionalString(workflowList.description)
              }
              onClick={() => {
                updateWorkflowList(workflowList.apiId, state, userApiId).then((_res) => {
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
        </div>
      </div>
    </div>
  )
}

export default ModifyListModal

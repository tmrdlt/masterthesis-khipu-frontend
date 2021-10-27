import { CreateWorkflowListEntity, WorkflowListType } from 'utils/models'
import React, { ChangeEvent } from 'react'
import { PlusIcon } from 'components/icons'

interface CreateChildrenFormProps {
  defaultCreateType: WorkflowListType
  createChildren: Array<CreateWorkflowListEntity>
  setCreateChildren
}

const CreateChildrenForm = ({
  defaultCreateType,
  createChildren,
  setCreateChildren,
}: CreateChildrenFormProps): JSX.Element => {
  // FUNCTIONS
  const handleFormChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const newState = [...createChildren]
    let newElement: CreateWorkflowListEntity = {
      ...newState[index],
      [event.target.id]: event.target.value,
    }
    newState.splice(index, 1, newElement)
    setCreateChildren(newState)
  }

  const addEmptyCreateChild = () => {
    const newState = [...createChildren]
    newState.push({
      title: '',
      listType: defaultCreateType,
      parentApiId: null,
      description: '',
      isTemporalConstraintBoard: false,
    })
    setCreateChildren(newState)
  }

  const removeCreateChild = (index: number) => {
    const newState = [...createChildren]
    newState.splice(index, 1)
    setCreateChildren(newState)
  }

  return (
    <div>
      <span className="text-gray-700">Children</span>
      <div className="grid grid-cols-1 gap-4 mt-1">
        {createChildren.map((createEntity, index) => {
          return (
            <div className="flex items-center justify-between" key={index}>
              <div className="grid grid-cols-2">
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                  value={createEntity.title}
                  placeholder="Title (required)"
                  onChange={(event) => {
                    handleFormChange(event, index)
                  }}
                  id="title"
                />
                <div className="flex items-center justify-center">
                  <label className="inline-flex items-center mr-3">
                    <input
                      type="radio"
                      value={WorkflowListType.BOARD}
                      id="listType"
                      checked={createChildren[index].listType === WorkflowListType.BOARD}
                      onChange={(event) => {
                        handleFormChange(event, index)
                      }}
                      className="h-4 w-4"
                    />
                    <span className="ml-1">Board</span>
                  </label>
                  <label className="inline-flex items-center mr-3">
                    <input
                      type="radio"
                      value={WorkflowListType.LIST}
                      id="listType"
                      checked={createChildren[index].listType === WorkflowListType.LIST}
                      onChange={(event) => {
                        handleFormChange(event, index)
                      }}
                      className="h-4 w-4"
                    />
                    <span className="ml-1">List</span>
                  </label>
                  <label className="inline-flex items-center mr-3">
                    <input
                      type="radio"
                      value={WorkflowListType.ITEM}
                      id="listType"
                      checked={createChildren[index].listType === WorkflowListType.ITEM}
                      onChange={(event) => {
                        handleFormChange(event, index)
                      }}
                      className="h-4 w-4"
                    />
                    <span className="ml-1">Item</span>
                  </label>
                </div>
              </div>
              <button
                className="text-gray-700"
                onClick={() => {
                  removeCreateChild(index)
                }}
              >
                &#x2715;
              </button>
            </div>
          )
        })}
        <button
          type="button"
          onClick={() => {
            addEmptyCreateChild()
          }}
          className="bg-transparent hover:bg-gray-50 text-gray-500 border border-gray-500 rounded w-8 h-8"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  )
}

export default CreateChildrenForm

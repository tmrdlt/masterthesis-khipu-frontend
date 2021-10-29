import { CreateWorkflowListEntity, WorkflowListType } from 'utils/models'
import React, { ChangeEvent } from 'react'
import AddButton from 'components/buttons/add-button'
import CreateTitleAndTypeForm from 'components/modals/create-title-and-type-form'
import { getLowerWorkflowListType } from 'utils/models-util'

interface CreateChildrenFormProps {
  parentType: WorkflowListType
  createChildren: Array<CreateWorkflowListEntity>
  setCreateChildren
}

const CreateChildrenForm = ({
  parentType,
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
      listType: getLowerWorkflowListType(parentType),
      parentApiId: null,
      description: null,
      isTemporalConstraintBoard: false,
      children: []
    })
    setCreateChildren(newState)
  }

  const removeCreateChild = (index: number) => {
    const newState = [...createChildren]
    newState.splice(index, 1)
    setCreateChildren(newState)
  }

  const addKanbanBoardColumns = () => {
    let newState = [...createChildren]
    newState.push({
      title: 'ToDo',
      listType: WorkflowListType.LIST,
      parentApiId: null,
      description: null,
      isTemporalConstraintBoard: false,
      children: []
    })
    newState.push({
      title: 'Doing',
      listType: WorkflowListType.LIST,
      parentApiId: null,
      description: null,
      isTemporalConstraintBoard: false,
      children: []
    })
    newState.push({
      title: 'Done',
      listType: WorkflowListType.LIST,
      parentApiId: null,
      description: null,
      isTemporalConstraintBoard: false,
      children: []
    })
    setCreateChildren(newState)
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {parentType == WorkflowListType.BOARD && (
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
      {createChildren.map((createEntity, index) => {
        return (
          <div className="flex items-center justify-between gap-4" key={index}>
            <CreateTitleAndTypeForm
              index={index}
              createEntity={createEntity}
              handleFormChange={handleFormChange}
            />
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
      <AddButton addString={'child'} addFunction={addEmptyCreateChild} />
    </div>
  )
}

export default CreateChildrenForm

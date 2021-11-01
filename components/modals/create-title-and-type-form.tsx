import { CreateWorkflowListEntity, WorkflowListType } from 'utils/models'
import { getRequiredClass } from 'utils/style-elements'
import React from 'react'

interface CreateTitleAndTypeFormProps {
  index: number
  createEntity: CreateWorkflowListEntity
  handleFormChange
}

const CreateTitleAndTypeForm = ({
  index,
  createEntity,
  handleFormChange,
}: CreateTitleAndTypeFormProps): JSX.Element => {
  return (
    <div className="flex justify-between w-full gap-4" key={index}>
      <input
        type="text"
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring-opacity-50 text-sm ${getRequiredClass(
          createEntity.title === ''
        )}`}
        value={createEntity.title}
        placeholder="Title (required)"
        onChange={(event) => handleFormChange(event, index)}
        id="title"
        autoFocus
      />
      <div className="flex items-center justify-center gap-2">
        <label className="inline-flex items-center gap-1">
          <input
            type="radio"
            value={WorkflowListType.BOARD}
            id="listType"
            checked={createEntity.listType === WorkflowListType.BOARD}
            onChange={(event) => handleFormChange(event, index)}
            className="h-4 w-4"
          />
          <span>Board</span>
        </label>
        <label className="inline-flex items-center gap-1">
          <input
            type="radio"
            value={WorkflowListType.LIST}
            id="listType"
            checked={createEntity.listType === WorkflowListType.LIST}
            onChange={(event) => handleFormChange(event, index)}
            className="h-4 w-4"
          />
          <span>List</span>
        </label>
        <label className="inline-flex items-center gap-1">
          <input
            type="radio"
            value={WorkflowListType.ITEM}
            id="listType"
            checked={createEntity.listType === WorkflowListType.ITEM}
            onChange={(event) => handleFormChange(event, index)}
            className="h-4 w-4"
          />
          <span>Item</span>
        </label>
      </div>
    </div>
  )
}

export default CreateTitleAndTypeForm

import { WorkflowListType } from 'utils/models'

const grid = 8

export const getDraggableStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  width: isDragging ? 400 : 200,
  ...draggableStyle,
})

export const getDroppableStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightgreen' : 'transparent',
})

export const getMargin = (parentType: WorkflowListType): string => {
  if (parentType == WorkflowListType.BOARD) {
    return 'mr-2'
  } else {
    return 'mb-2'
  }
}

export const getRequiredClass = (required: boolean): string => {
  return required
    ? 'ring ring-red-500 ring-opacity-50 focus:ring focus:ring-red-500'
    : 'focus:ring focus:ring-indigo-200'
}

export const getMoveClass = (showMoveModal: boolean): string => {
  return showMoveModal ? 'z-20 relative transition-all' : ''
}

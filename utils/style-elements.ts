import { WorkflowListType } from 'utils/models'

const grid = 8

export const getDraggableStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  width: isDragging ? 400 : 200,
  ...draggableStyle,
})

export const getDroppableStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightgreen' : 'transparent'
})

export const getMargin = (parentType: WorkflowListType): string => {
  if (parentType == WorkflowListType.BOARD) {
    return 'mr-2'
  } else {
    return 'mb-2'
  }
}

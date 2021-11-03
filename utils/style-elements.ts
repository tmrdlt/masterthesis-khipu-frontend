import { WorkflowListType } from 'utils/models'

const grid = 8

export const getDraggableStyle = (isDragging): string => (isDragging ? '' : '')

export const getDroppableStyle = (isDraggingOver): string =>
  isDraggingOver
    ? 'border border-dashed rounded border-2 border-blueGray-500 border-opacity-100 transition-opacity duration-500 ease-in-out'
    : 'border border-dashed border-2 border-blueGray-500 rounded border-opacity-0 transition-opacity transition duration-500 ease-in-out'

export const getMargin = (
  parentType: WorkflowListType,
  position: number,
  parentLength: number
): string => {
  if (position + 1 === parentLength) {
    return ''
  } else {
    if (parentType === WorkflowListType.ROOT) {
      return 'mb-2' + ' ' + position
    } else if (parentType == WorkflowListType.BOARD) {
      return 'mr-2' + ' ' + position
    } else if (parentType == WorkflowListType.LIST) {
      return 'mb-2' + ' ' + position
    }
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

export const getBorderClassBoard = (level: number): string => {
  if (level >= 0) {
    return 'border-t-4 border-blue-300 rounded-tr rounded-b'
  } else {
  }
}

export const getBorderClassList = (level: number): string => {
  if (level >= 0) {
    return 'border-t-4 border-red-200 rounded-tr rounded-b'
  } else {
  }
}

export const getBorderClassItem = (level: number): string => {
  if (level >= 0) {
    return 'border-t-4 border-blueGray-100 rounded-tr rounded-b'
  } else {
  }
}

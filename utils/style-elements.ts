import { WorkflowListType } from 'utils/models'

const grid = 8

export const getDraggableStyle = (isDragging): string => (isDragging ? '' : '')

export const getDroppableStyle = (isDraggingOver): string =>
  isDraggingOver
    ? 'border border-dashed rounded border-2 border-slate-600 border-opacity-100 transition-opacity duration-500 ease-in-out'
    : 'border border-dashed border-2 border-slate-600 rounded border-opacity-0 transition-opacity transition duration-500 ease-in-out'

export const getMargin = (
  parentType: WorkflowListType,
  position: number,
  parentLength: number
): string => {
  if (parentType === WorkflowListType.ROOT) {
    return 'mb-2'
  } else if (parentType == WorkflowListType.BOARD) {
    return 'mr-2'
  } else if (parentType == WorkflowListType.LIST) {
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

export const getBorderClassBoard = (level: number): string => {
  if (level >= 0) {
    return `border rounded-tr rounded-b ${getBackgroundColor(level)}`
  } else {
  }
}

export const getBorderClassList = (level: number): string => {
  if (level >= 0) {
    return `border rounded-tr rounded-b ${getBackgroundColor(level)}`
  } else {
  }
}

export const getBorderClassItem = (level: number): string => {
  if (level >= 0) {
    return `border rounded-tr rounded-b ${getBackgroundColor(level)}`
  } else {
  }
}

export const getBackgroundColor = (level: number): string => {
  console.log(level)
  if (level === 0) return 'bg-khipu-bg-1 border-khipu-border-1 text-khipu-text'
  else if (level === 1) return 'bg-khipu-bg-2 border-khipu-border-1 text-khipu-text'
  else if (level === 2) return 'bg-khipu-bg-3 border-khipu-border-1 text-khipu-text'
  else if (level === 3) return 'bg-slate-600 border-khipu-border-2 text-slate-200'
  else if (level === 4) return 'bg-slate-500 border-khipu-border-2 text-slate-200'
  else if (level === 5) return 'bg-slate-400 border-khipu-border-2 text-slate-800'
  else if (level === 6) return 'bg-slate-300 border-khipu-border-2 text-slate-800'
  else if (level === 7) return 'bg-slate-200 border-khipu-border-2 text-slate-800'
  else if (level === 8) return 'bg-slate-100 border-khipu-border-2 text-slate-800'
  else if (level === 9) return 'bg-slate-50 border-khipu-border-2 text-slate-800'
  else return 'bg-white border-khipu-border-2 text-slate-800'


}

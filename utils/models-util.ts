import { WorkflowListType } from 'utils/models'

export const getLowerWorkflowListType = (workflowListType?: WorkflowListType): WorkflowListType => {
  if (workflowListType == null) {
    return WorkflowListType.BOARD
  } else if (workflowListType == WorkflowListType.BOARD) {
    return WorkflowListType.LIST
  } else {
    return WorkflowListType.ITEM
  }
}

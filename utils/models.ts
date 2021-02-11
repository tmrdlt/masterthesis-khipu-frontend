export type WorkflowList = {
    id: number,
    uuid: string,
    title: string,
    description?: string,
    usageType: WorkflowListType,
    children: Array<WorkflowList>,
    level: number
    order: number
}

export type CreateWorkflowListEntity = {
    title: string,
    description?: string,
    usageType: WorkflowListType
    parentUuid?: string
}

export type UpdateWorkflowListEntity = {
    newTitle: string,
    newDescription?: string
}

export type MoveWorkflowListEntity = {
    newParentUuid?: string
}

export type ConvertWorkflowListEntity = {
    newUsageType: WorkflowListType
}

export type ReorderWorkflowListEntity = {
    newOrderIndex: number
}

export enum WorkflowListType {
    BOARD = "BOARD", LIST = "LIST", ITEM = "ITEM"
}

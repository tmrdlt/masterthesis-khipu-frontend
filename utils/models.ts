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
    listType: WorkflowListType
    parentApiId?: string
}

export type UpdateWorkflowListEntity = {
    newTitle: string,
    newDescription?: string
}

export type MoveWorkflowListEntity = {
    newParentApiId?: string
    newPosition?: number
}

export type ConvertWorkflowListEntity = {
    newListType: WorkflowListType
}

export type ReorderWorkflowListEntity = {
    newPosition: number
}

export enum WorkflowListType {
    BOARD = "BOARD", LIST = "LIST", ITEM = "ITEM"
}

export type WorkflowList = {
    id: number,
    uuid: string,
    title: string,
    description?: string,
    usageType: WorkflowListType,
    children: Array<WorkflowList>
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

export enum WorkflowListType {
    BOARD = "BOARD", LIST = "LIST", ITEM = "ITEM"
}

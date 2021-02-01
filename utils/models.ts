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
    parentUuid?: string
}

export type UpdateWorkflowListEntity = {
    newTitle?: string,
    newDescription?: string,
    newParentUuid?: string
}

export enum WorkflowListType {
    Board = "BOARD", List = "LIST", Item = "ITEM"
}

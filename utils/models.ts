export type WorkflowList = {
    id: number,
    uuid: string,
    title: string,
    description: string,
    usageType: String,
    children: Array<WorkflowList>
}

export type CreateWorkflowListEntity = {
    title: string,
    description?: string,
    parentUuid?: string
}

export enum WorkflowListType {
    Board = "Board", List = "List", Item = "Item"
}

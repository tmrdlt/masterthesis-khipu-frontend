export type WorkflowList = {
    id: number,
    uuid: string,
    title: string,
    description?: string,
    usageType: WorkflowListType,
    children: Array<WorkflowList>,
    level: number
    position: number,
    isTemporalConstraintBoard: boolean,
    temporalConstraint?: TemporalConstraint
}

export type WorkflowListSimple = {
    apiId: string,
    title: string
}

export type CreateWorkflowListEntity = {
    title: string,
    description?: string,
    listType: WorkflowListType
    parentApiId?: string
}

export type UpdateWorkflowListEntity = {
    newTitle: string,
    newDescription?: string,
    isTemporalConstraintBoard?: boolean,
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

export type TemporalConstraint = {
    temporalConstraintType: TemporalConstraintType,
    dueDate?: Date,
    connectedWorkflowList?: WorkflowListSimple
}

export enum WorkflowListType {
    BOARD = "BOARD", LIST = "LIST", ITEM = "ITEM"
}

export enum TemporalConstraintType {
    projectDueDate = "projectDueDate", itemToBeInList = "itemToBeInList", dependsOn = "dependsOn"
}

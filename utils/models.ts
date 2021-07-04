// FROM BACKEND
export type WorkflowList = {
    apiId: string,
    title: string,
    description?: string,
    usageType: WorkflowListType,
    children: Array<WorkflowList>,
    level: number
    position: number,
    isTemporalConstraintBoard: boolean,
    temporalResource?: TemporalResource
    genericResources: Array<GenericResource>
}

export type CreateWorkflowListEntity = {
    title: string,
    description?: string,
    listType: WorkflowListType
    parentApiId?: string
    userApiId: string
}

export type UpdateWorkflowListEntity = {
    newTitle: string,
    newDescription?: string,
    isTemporalConstraintBoard?: boolean,
}

export type MoveWorkflowListEntity = {
    newParentApiId?: string
    newPosition?: number
    userApiId: string
}

export type ConvertWorkflowListEntity = {
    newListType: WorkflowListType
}

export type ReorderWorkflowListEntity = {
    newPosition: number
}

export type GenericResource = {
    label: string,
    value: number
}

export type TemporalResource = {
    startDate?: Date,
    endDate?: Date,
    durationInMinutes?: string,
    connectedWorkflowListApiId?: string
}

export enum WorkflowListType {
    BOARD = "BOARD", LIST = "LIST", ITEM = "ITEM"
}

export type User = {
    apiId: string,
    username: string,
    createdAt: Date,
    endDate: Date,
}

export type CreateUserEntity = {
    username: string
}

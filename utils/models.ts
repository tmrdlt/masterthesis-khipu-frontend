// FROM BACKEND
export type WorkflowList = {
    apiId: string
    title: string
    description?: string
    usageType: WorkflowListType
    children: Array<WorkflowList>
    level: number
    position: number
    isTemporalConstraintBoard: boolean,
    temporalResource?: TemporalResource
    userResource?: UserResource
    numericResources: Array<NumericResource>
    textualResources: Array<TextualResource>
}

export type CreateWorkflowListEntity = {
    title: string
    description?: string
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

export type WorkflowListResource = {
    numeric?: Array<NumericResource>
    textual?: Array<TextualResource>
    temporal?: TemporalResource
    user?: UserResource
}

export type NumericResource = {
    label: string,
    value: number
}

export type TextualResource = {
    label: string,
    value?: string
}

export type UserResource = {
    username: string
}

export type TemporalResource = {
    startDate?: Date,
    endDate?: Date,
    durationInMinutes?: number
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

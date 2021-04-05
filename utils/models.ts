// FRONTEND ONLY
export enum TemporalConstraintType {
    noConstraint= "noConstraint", constraint = "constraint", itemToBeInList = "itemToBeInList", dependsOn = "dependsOn"
}


export type WorkflowListSimple = {
    apiId: string,
    title: string
}

// FROM BACKEND
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

export const workflowListToWorkflowListSimple = (wl: WorkflowList): WorkflowListSimple => {
    return {
        apiId: wl.uuid,
        title: wl.title
    }
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
    startDate?: Date,
    endDate?: Date,
    durationInMinutes?: string,
    connectedWorkflowListApiId?: string
}

export enum WorkflowListType {
    BOARD = "BOARD", LIST = "LIST", ITEM = "ITEM"
}

export type WorkflowList = {
    id: number,
    uuid: string,
    title: string,
    description: string,
    usageType: String,
    children: Array<WorkflowList>
}

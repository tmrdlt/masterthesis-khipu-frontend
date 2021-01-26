export type WorkflowList = {
    id: number,
    uuid: string,
    title: string,
    description: string,
    children: Array<WorkflowList>
}

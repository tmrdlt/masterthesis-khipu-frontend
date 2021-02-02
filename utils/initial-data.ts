import {WorkflowList, WorkflowListType} from "utils/models";

export const initialData: Array<WorkflowList> =
    [
        {
            id: 1,
            uuid: 'board-1',
            title: 'To do',
            description: 'test',
            usageType: WorkflowListType.Board,
            children: [
                {
                    id: 1,
                    uuid: 'list-1',
                    title: 'To do',
                    description: 'test',
                    usageType: WorkflowListType.List,
                    children: [
                        {id: 3, uuid: 'item-3', title: 'item', description: 'item-3', usageType: WorkflowListType.Item, children: []},
                        {id: 4, uuid: 'item-4', title: 'item', description: 'item-4', usageType: WorkflowListType.Item, children: []}
                    ]
                },
                {
                    id: 2,
                    uuid: 'list-2',
                    title: 'In progress',
                    description: 'test',
                    usageType: WorkflowListType.List,
                    children: [
                        {id: 5, uuid: 'item-5', title: 'item', description: 'item-5', usageType: WorkflowListType.Item, children: []},
                        {id: 6, uuid: 'item-6', title: 'item', description: 'item-6', usageType: WorkflowListType.Item, children: []}

                    ]
                }
            ]
        }
    ];




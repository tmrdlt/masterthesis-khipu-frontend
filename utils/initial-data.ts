import axios from "axios";
import {WorkflowList} from "utils/models";

const getWorkflowLists = async () => {
    return axios.get('http://localhost:5001/workflowList', {
        method: 'GET'
    }).then(res => {
        console.log(res);
        return res.data;
    }).catch(e => {
        console.error(e);
    });

}


export const initialData: Array<WorkflowList> =
    [
        {
            id: 1,
            uuid: 'board-1',
            title: 'To do',
            description: 'test',
            usageType: 'BOARD',
            children: [
                {
                    id: 1,
                    uuid: 'list-1',
                    title: 'To do',
                    description: 'test',
                    usageType: 'LIST',
                    children: [
                        {id: 3, uuid: 'item-3', title: 'item', description: 'item-3', usageType: 'ITEM', children: []},
                        {id: 4, uuid: 'item-4', title: 'item', description: 'item-4', usageType: 'ITEM', children: []}
                    ]
                },
                {
                    id: 2,
                    uuid: 'list-2',
                    title: 'In progress',
                    description: 'test',
                    usageType: 'LIST',
                    children: [
                        {id: 5, uuid: 'item-5', title: 'item', description: 'item-5', usageType: 'ITEM', children: []},
                        {id: 6, uuid: 'item-6', title: 'item', description: 'item-6', usageType: 'ITEM', children: []}

                    ]
                }
            ]
        }
    ];




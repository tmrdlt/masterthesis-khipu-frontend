import axios from "axios";
import {List} from "utils/models";

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


export const initialData: Array<List> =
    [
        {
            id: 'list-1',
            title: 'To do',
            children: [
                {id: 'item-1', description: 'Take out the garbage'},
                {id: 'item-2', description: 'Watch my favorite show'},
                {id: 'item-3', description: 'Charge my phone'},
                {id: 'item-4', description: 'Cook dinner'}
            ]
        },
        {
            id: 'list-2',
            title: 'In progress',
            children: [
                {id: 'item-5', description: 'Take out the garbage'},
                {id: 'item-6', description: 'Watch my favorite show'},
                {id: 'item-7', description: 'Charge my phone'},
                {id: 'item-8', description: 'Cook dinner'}
            ]
        }
    ];




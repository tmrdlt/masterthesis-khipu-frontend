import axios from "axios";
import {CreateWorkflowListEntity, WorkflowList} from "utils/models";

export const getWorkflowLists = async (): Promise<Array<WorkflowList> | null> => {
    return axios.get('http://localhost:5001/workflowList')
        .then(response => {
            const workflowLists: Array<WorkflowList> = response.data;
            console.log(workflowLists);
            return workflowLists;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const createWorkflowList = async (createWorkflowListEntity: CreateWorkflowListEntity) => {
    return axios.post('http://localhost:5001/workflowList', createWorkflowListEntity)
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

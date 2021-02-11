import axios from "axios";
import {
    ConvertWorkflowListEntity,
    CreateWorkflowListEntity,
    MoveWorkflowListEntity, ReorderWorkflowListEntity,
    UpdateWorkflowListEntity,
    WorkflowList
} from "utils/models";

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

export const postWorkflowList = async (createWorkflowListEntity: CreateWorkflowListEntity) => {
    return axios.post('http://localhost:5001/workflowList', createWorkflowListEntity)
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const putWorkflowList = async (uuid: string, updateWorkflowListEntity: UpdateWorkflowListEntity) => {
    return axios.put('http://localhost:5001/workflowList/' + uuid, updateWorkflowListEntity)
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const deleteWorkflowList = async (uuid: string) => {
    return axios.delete('http://localhost:5001/workflowList/' + uuid)
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const postWorkflowListMove = async (uuid: string, moveWorkflowListEntity: MoveWorkflowListEntity) => {
    return axios.post('http://localhost:5001/workflowList/' + uuid + '/move', moveWorkflowListEntity)
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const postWorkflowListConvert = async (uuid: string, convertWorkflowListEntity: ConvertWorkflowListEntity) => {
    return axios.post('http://localhost:5001/workflowList/' + uuid + '/convert', convertWorkflowListEntity)
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const postWorkflowListReorder = async (uuid: string, reorderWorkflowListEntity: ReorderWorkflowListEntity) => {
    return axios.post('http://localhost:5001/workflowList/' + uuid + '/reorder', reorderWorkflowListEntity)
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

import axios from "axios";
import {
    ConvertWorkflowListEntity,
    CreateWorkflowListEntity,
    MoveWorkflowListEntity,
    ReorderWorkflowListEntity,
    TemporalConstraint,
    UpdateWorkflowListEntity,
    WorkflowList
} from "utils/models";
import {toLocalDateTimeString} from "utils/date-util";
import {recursiveParseDate} from "utils/list-util";

export const getWorkflowLists = async (): Promise<Array<WorkflowList> | null> => {
    return axios.get<Array<WorkflowList>>('http://localhost:5001/workflowlist')
        .then(response => {
            const workflowLists = response.data
            recursiveParseDate(workflowLists)
            console.log(workflowLists);
            return workflowLists;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const postWorkflowList = async (createWorkflowListEntity: CreateWorkflowListEntity) => {
    return axios.post('http://localhost:5001/workflowlist', createWorkflowListEntity)
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const putWorkflowList = async (uuid: string, updateWorkflowListEntity: UpdateWorkflowListEntity) => {
    return axios.put('http://localhost:5001/workflowlist/' + uuid, updateWorkflowListEntity)
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const deleteWorkflowList = async (uuid: string) => {
    return axios.delete('http://localhost:5001/workflowlist/' + uuid)
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const postWorkflowListMove = async (uuid: string, moveWorkflowListEntity: MoveWorkflowListEntity) => {
    return axios.post('http://localhost:5001/workflowlist/' + uuid + '/move', moveWorkflowListEntity)
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const postWorkflowListConvert = async (uuid: string, convertWorkflowListEntity: ConvertWorkflowListEntity) => {
    return axios.post('http://localhost:5001/workflowlist/' + uuid + '/convert', convertWorkflowListEntity)
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const postWorkflowListReorder = async (uuid: string, reorderWorkflowListEntity: ReorderWorkflowListEntity) => {
    return axios.post('http://localhost:5001/workflowlist/' + uuid + '/reorder', reorderWorkflowListEntity)
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const postTemporalConstraint = async (uuid: string, temporalConstraint: TemporalConstraint) => {
    console.log(temporalConstraint)
    return axios.post(
        'http://localhost:5001/workflowlist/' + uuid + '/tempconstraint',
        {...temporalConstraint, startDate: toLocalDateTimeString(temporalConstraint.startDate), endDate: toLocalDateTimeString(temporalConstraint.endDate)}
    )
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

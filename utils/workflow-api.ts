import axios from "axios";
import {
    ConvertWorkflowListEntity,
    CreateUserEntity,
    CreateWorkflowListEntity,
    MoveWorkflowListEntity,
    ReorderWorkflowListEntity,
    TemporalQueryResult,
    UpdateWorkflowListEntity,
    User,
    WorkflowList,
    WorkflowListResource
} from "utils/models";
import {toLocalDateTimeString} from "utils/date-util";
import {recursiveParseDate} from "utils/list-util";

export const getWorkflowLists = async (userApiId: string): Promise<Array<WorkflowList> | null> => {
    return axios.get<Array<WorkflowList>>('http://localhost:5001/workflowlist?userApiId=' + userApiId)
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

export const updateWorkflowList = async (uuid: string, updateWorkflowListEntity: UpdateWorkflowListEntity) => {
    return axios.patch('http://localhost:5001/workflowlist/' + uuid, updateWorkflowListEntity)
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

export const postWorkflowListResource = async (uuid: string, workflowListResource: WorkflowListResource) => {
    console.log(workflowListResource)
    return axios.post(
        'http://localhost:5001/workflowlist/' + uuid + '/resource',
        {
            ...workflowListResource,
            temporal: workflowListResource.temporal ? {
                ...workflowListResource.temporal,
                startDate: toLocalDateTimeString(workflowListResource.temporal.startDate),
                endDate: toLocalDateTimeString(workflowListResource.temporal.endDate)
            } : null
        }
    )
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const getUsers = async (): Promise<Array<User> | null> => {
    return axios.get<Array<User>>('http://localhost:5001/user')
        .then(response => {
            return response.data;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const getUser = async (userApiId): Promise<User | null> => {
    return axios.get<Array<User>>('http://localhost:5001/user/' + userApiId)
        .then(response => {
            return response.data;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const postUser = async (createUserEntity: CreateUserEntity) => {
    return axios.post('http://localhost:5001/user', createUserEntity)
        .then(response => {
            return response;
        }).catch(error => {
            console.error(error);
            return null
        });
}

export const getTemporalQuery = async (workflowListApiId: String): Promise<TemporalQueryResult | null> => {
    return axios.get<TemporalQueryResult>('http://localhost:5001/workflowlist/' + workflowListApiId + '/query')
        .then(response => {
            return response.data;
        }).catch(error => {
            console.error(error);
            return null
        });
}

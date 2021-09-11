import axios from 'axios'
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
  WorkflowListResource,
} from 'utils/models'
import { toLocalDateTimeString } from 'utils/date-util'
import { recursiveParseDate } from 'utils/list-util'

export const getWorkflowListsUrl = (userApiId: String): string => {
  return `http://localhost:5001/workflowlist?userApiId=${userApiId}`
}

export const getUsersUrl = (): string => {
    return 'http://localhost:5001/user'
}

export const getWorkflowListsFetcher = (url): Promise<Array<WorkflowList>> => {
    return axios.get<Array<WorkflowList>>(url).then((res) => {
        const workflowLists = res.data
        recursiveParseDate(workflowLists)
        return workflowLists
    })
}

export const getUsersFetcher = (url): Promise<Array<User>> => {
    return axios
        .get<Array<User>>(url)
        .then((res) => {
            return res.data
        })
}

export const getUserFetcher = (userApiId): Promise<User | undefined> => {
    return axios
        .get<User>(`http://localhost:5001/user/${userApiId}`)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            console.error(error)
            return null
        })
}

export const createWorkflowList = async (entity: CreateWorkflowListEntity) => {
  const newEntity = { ...entity, newDescription: entity.description == '' ? null : entity.description }
  return axios
    .post('http://localhost:5001/workflowlist', newEntity)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const updateWorkflowList = async (
  uuid: string,
  entity: UpdateWorkflowListEntity
) => {
  const newEntity = { ...entity, newDescription: entity.newDescription == '' ? null : entity.newDescription }
  return axios
    .patch('http://localhost:5001/workflowlist/' + uuid, newEntity)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const deleteWorkflowList = async (uuid: string) => {
  return axios
    .delete('http://localhost:5001/workflowlist/' + uuid)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const postWorkflowListMove = async (
  uuid: string,
  moveWorkflowListEntity: MoveWorkflowListEntity
) => {
  return axios
    .post('http://localhost:5001/workflowlist/' + uuid + '/move', moveWorkflowListEntity)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const postWorkflowListConvert = async (
  uuid: string,
  convertWorkflowListEntity: ConvertWorkflowListEntity
) => {
  return axios
    .post('http://localhost:5001/workflowlist/' + uuid + '/convert', convertWorkflowListEntity)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const postWorkflowListReorder = async (
  uuid: string,
  reorderWorkflowListEntity: ReorderWorkflowListEntity
) => {
  return axios
    .post('http://localhost:5001/workflowlist/' + uuid + '/reorder', reorderWorkflowListEntity)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const postWorkflowListResource = async (
  uuid: string,
  workflowListResource: WorkflowListResource
) => {
  return axios
    .post('http://localhost:5001/workflowlist/' + uuid + '/resource', {
      ...workflowListResource,
      temporal: workflowListResource.temporal
        ? {
            ...workflowListResource.temporal,
            startDate: toLocalDateTimeString(workflowListResource.temporal.startDate),
            endDate: toLocalDateTimeString(workflowListResource.temporal.endDate),
          }
        : null,
    })
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const createUser = async (createUserEntity: CreateUserEntity) => {
  return axios
    .post('http://localhost:5001/user', createUserEntity)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const getTemporalQuery = async (
  workflowListApiId: String
): Promise<TemporalQueryResult | null> => {
  return axios
    .get<TemporalQueryResult>('http://localhost:5001/workflowlist/' + workflowListApiId + '/query')
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

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

const host = 'http://localhost:5001'
// const host = "https://phenomenon-statements-discounted-accommodation.trycloudflare.com"

export const getWorkflowListsUrl = (userApiId: String): string => {
  return `${host}/workflowlist?userApiId=${userApiId}`
}

export const getUsersUrl = (): string => {
  return `${host}/user`
}

export const getWorkflowListsFetcher = (url): Promise<Array<WorkflowList>> => {
  return axios.get<Array<WorkflowList>>(url).then((res) => {
    const workflowLists = res.data
    recursiveParseDate(workflowLists)
    return workflowLists
  })
}

export const getUsersFetcher = (url): Promise<Array<User>> => {
  return axios.get<Array<User>>(url).then((res) => {
    return res.data
  })
}

export const getUserFetcher = (userApiId): Promise<User | undefined> => {
  return axios
    .get<User>(`${host}/user/${userApiId}`)
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const postWorkflowList = async (
  entity: CreateWorkflowListEntity,
  userApiId: string
): Promise<string | undefined> => {
  const newEntity = {
    ...entity,
    newDescription: entity.description == '' ? null : entity.description,
  }
  return axios
    .post<String>(`${host}/workflowlist`, newEntity, {
      headers: {
        Authorization: userApiId,
      },
    })
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const deleteWorkflowList = async (
    workflowListApiId: string,
    userApiId: string
) => {
  return axios
      .delete(`${host}/workflowlist/${workflowListApiId}`, {
        headers: {
          Authorization: userApiId,
        },
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        return null
      })
}

export const putWorkflowList = async (
  workflowListApiId: string,
  entity: UpdateWorkflowListEntity,
  userApiId: string
) => {
  const newEntity = {
    ...entity,
    newDescription: entity.newDescription == '' ? null : entity.newDescription,
  }
  return axios
    .put(`${host}/workflowlist/${workflowListApiId}`, newEntity, {
      headers: {
        Authorization: userApiId,
      },
    })
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const putWorkflowListParent = async (
  workflowListApiId: string,
  entity: MoveWorkflowListEntity,
  userApiId: string
) => {
  return axios
    .put(`${host}/workflowlist/${workflowListApiId}/parent`, entity, {
      headers: {
        Authorization: userApiId,
      },
    })
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const putWorkflowListType = async (
  workflowListApiId: string,
  entity: ConvertWorkflowListEntity,
  userApiId: string
) => {
  return axios
    .put(`${host}/workflowlist/${workflowListApiId}/type`, entity, {
      headers: {
        Authorization: userApiId,
      },
    })
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const putWorkflowListPosition = async (
  workflowListApiId: string,
  entity: ReorderWorkflowListEntity,
  userApiId: string
) => {
  return axios
    .put(`${host}/workflowlist/${workflowListApiId}/position`, entity, {
      headers: {
        Authorization: userApiId,
      },
    })
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const putWorkflowListResource = async (
  workflowListApiId: string,
  workflowListResource: WorkflowListResource,
  userApiId: string
) => {
  return axios
    .put(
      `${host}/workflowlist/${workflowListApiId}/resource`,
      {
        ...workflowListResource,
        temporal: workflowListResource.temporal
          ? {
              ...workflowListResource.temporal,
              startDate: toLocalDateTimeString(workflowListResource.temporal.startDate),
              dueDate: toLocalDateTimeString(workflowListResource.temporal.dueDate),
            }
          : null,
      },
      {
        headers: {
          Authorization: userApiId,
        },
      }
    )
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const postUser = async (createUserEntity: CreateUserEntity) => {
  return axios
    .post(`${host}/user`, createUserEntity)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const getWorkflowListScheduling = async (
  workflowListApiId: String,
  userApiId: string
): Promise<TemporalQueryResult | null> => {
  return axios
    .get<TemporalQueryResult>(`${host}/workflowlist/${workflowListApiId}/scheduling`, {
      headers: {
        Authorization: userApiId,
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

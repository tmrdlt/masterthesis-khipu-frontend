import { TemporalResource, UserResource, WorkflowList, WorkflowListResource } from 'utils/models'
import { getOptionalNumber, getOptionalString } from 'utils/optional-util'

export const hasNoTemporalResource = (temporalResource?: TemporalResource): boolean => {
  if (!temporalResource) {
    return true
  } else {
    return (
      temporalResource.startDate == null &&
      temporalResource.dueDate == null &&
      temporalResource.durationInMinutes == null
    )
  }
}

export const hasNoUserResource = (userResource?: UserResource): boolean => {
  if (!userResource) {
    return true
  } else {
    return userResource.username == null
  }
}

export const getInitWorkflowListResource = (workflowList?: WorkflowList): WorkflowListResource => {
  return workflowList
    ? {
        numeric: workflowList.numericResources ? [...workflowList.numericResources] : [], // cloning the array is important here!
        textual: workflowList.textualResources ? [...workflowList.textualResources] : [], // cloning the array is important here!
        temporal: workflowList.temporalResource
          ? {
              startDate: workflowList.temporalResource.startDate,
              dueDate: workflowList.temporalResource.dueDate,
              durationInMinutes: getOptionalNumber(workflowList.temporalResource.durationInMinutes),
            }
          : {
              startDate: null,
              dueDate: null,
              durationInMinutes: 0,
            },
        user: workflowList.userResource
          ? {
              username: getOptionalString(workflowList.userResource.username),
            }
          : {
              username: '',
            },
      }
    : {
        numeric: [],
        textual: [],
        temporal: {
          startDate: null,
          dueDate: null,
          durationInMinutes: 0,
        },
        user: {
          username: '',
        },
      }
}

export const getInitWorkflowListResourceBoard = (
  workflowList: WorkflowList
): WorkflowListResource => {
  return {
    temporal: {
      dueDate: workflowList.temporalResource ? workflowList.temporalResource.dueDate : null,
    },
  }
}

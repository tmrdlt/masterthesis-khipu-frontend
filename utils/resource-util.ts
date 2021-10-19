import { TemporalResource, UserResource, WorkflowList, WorkflowListResource } from 'utils/models'
import { getOptionalNumber, getOptionalString } from 'utils/optional-util'

export const hasNoTemporalResource = (temporalResource?: TemporalResource): boolean => {
  if (!temporalResource) {
    return true
  } else {
    return (
      temporalResource.startDate == null &&
      temporalResource.endDate == null &&
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
        numeric: workflowList.numericResources ? workflowList.numericResources : [],
        textual: workflowList.textualResources ? workflowList.textualResources : [],
        temporal: workflowList.temporalResource
          ? {
              startDate: workflowList.temporalResource.startDate,
              endDate: workflowList.temporalResource.endDate,
              durationInMinutes: getOptionalNumber(workflowList.temporalResource.durationInMinutes),
            }
          : {
              startDate: null,
              endDate: null,
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
          endDate: null,
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
      endDate: workflowList.temporalResource ? workflowList.temporalResource.endDate : null,
    },
  }
}

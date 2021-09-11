import { TemporalResource, UserResource } from 'utils/models'

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

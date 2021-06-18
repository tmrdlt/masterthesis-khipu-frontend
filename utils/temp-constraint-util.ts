import {TemporalResource} from "utils/models";

export const isNoConstraint = (temporalResource?: TemporalResource): boolean => {
    if (!temporalResource) {
        return true
    } else {
        return (temporalResource.startDate == null) && (temporalResource.endDate == null) && (temporalResource.durationInMinutes == null)
    }
}

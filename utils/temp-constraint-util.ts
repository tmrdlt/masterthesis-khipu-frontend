import {TemporalConstraint} from "utils/models";

export const isNoConstraint = (temporalConstraint?: TemporalConstraint): boolean => {
    if (!temporalConstraint) {
        return true
    } else {
        return (temporalConstraint.startDate == null) && (temporalConstraint.endDate == null) && (temporalConstraint.durationInMinutes == null)
    }
}

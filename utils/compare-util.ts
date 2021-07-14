import _ from "lodash"

const objectsEqual = (o1, o2) => {
    return _.isEqual(o1, o2)
}

export const arraysEqual = (a1, a2) =>
    a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

import {WorkflowList} from "utils/models";
import {DraggableLocation} from "react-beautiful-dnd";

/**
 * Recursively reorder items inside a list.
 */
export const recursiveReorder = (lists: Array<WorkflowList>,
                                 listUUidToReorder: string,
                                 startIndex: number,
                                 endIndex: number) => {
    if (listUUidToReorder == "ROOT") {
        const [removed] = lists.splice(startIndex, 1);
        lists.splice(endIndex, 0, removed);
    } else {
        lists.forEach(list => {
            if (list.apiId == listUUidToReorder) {
                const [removed] = list.children.splice(startIndex, 1);
                list.children.splice(endIndex, 0, removed);
            } else {
                recursiveReorder(list.children, listUUidToReorder, startIndex, endIndex)
            }
        })
    }
};

/**
 * Recursively move an item from one list to another list.
 */
export const recursiveMove = (lists: Array<WorkflowList>,
                              droppableSource: DraggableLocation,
                              droppableDestination: DraggableLocation) => {
    let elementToMove: WorkflowList;
    if (droppableSource.droppableId == "ROOT") {
        [elementToMove] = lists.splice(droppableSource.index, 1);
    } else {
        elementToMove = recursiveRemove(lists, droppableSource);
    }
    console.log("elementToMove", elementToMove)
    if (droppableDestination.droppableId == "ROOT") {
        lists.splice(droppableDestination.index, 0, elementToMove);
    } else {
        recursiveInsert(lists, droppableDestination, elementToMove);
    }
};

/**
 * Helper function for recursiveMove
 */
const recursiveRemove = (lists: Array<WorkflowList>,
                         droppableSource: DraggableLocation): WorkflowList => {
    for (let i = 0; i < lists.length; i++) {
        if (lists[i].apiId == droppableSource.droppableId) {
            const [elementToMove] = lists[i].children.splice(droppableSource.index, 1);
            return elementToMove
        }
        const elementToMove = recursiveRemove(lists[i].children, droppableSource)
        if (elementToMove) {
            return elementToMove;
        }
    }
}

/**
 * Helper function for recursiveMove
 */
const recursiveInsert = (lists: Array<WorkflowList>,
                         droppableDestination: DraggableLocation,
                         elementToMove: WorkflowList) => {
    lists.forEach(list => {
        if (list.apiId == droppableDestination.droppableId) {
            list.children.splice(droppableDestination.index, 0, elementToMove);
        } else {
            recursiveInsert(list.children, droppableDestination, elementToMove)
        }
    })
}

// @ts-ignore
export const isSameLevelOfSameParent = (lists: Array<WorkflowList>, parent?: WorkflowList, potentialChild: WorkflowList): boolean => {
    // We are on root
    if (parent == null) {
        return lists.map(list => list.apiId).includes(potentialChild.apiId)
    } else {
        return parent.children.map(list => list.apiId).includes(potentialChild.apiId)
    }
}

/**
 * Function to determine if in an Array of WorkflowList a child list is really a child list of some parent list
 */
export const isInsideParent = (parent?: WorkflowList, potentialChild?: WorkflowList): boolean => {
    // We are on root
    if (parent == null || potentialChild == null) {
        return false;
    } else {
        return recursiveContains(parent.children, potentialChild.apiId)

    }
}

/**
 * Helper function to check if an Array of WorkflowList contains a specific listUuid
 * @param lists: Array in which to search for
 * @param listUuid: Uuid to search for
 */
// TODO maybe write this nicer
const recursiveContains = (lists: Array<WorkflowList>, listUuid: string): boolean => {

    let contains = false;
    lists.some(list => {
        if (list.apiId == listUuid) {
            contains = true;
            return;
        } else if (list.children.length == 0) {
            return;
        } else {
            contains = recursiveContains(list.children, listUuid)
        }
    })
    return contains;
}

/**
 * Recursively parses the due date to a Javascript Date() as this is not done by axios JSON.parse()
 */
export const recursiveParseDate = (lists: Array<WorkflowList>) => {
    lists.forEach(wl => {
        if (wl.temporalConstraint) {
            if (wl.temporalConstraint.startDate) {
                wl.temporalConstraint.startDate = new Date(wl.temporalConstraint.startDate)
            }
            if (wl.temporalConstraint.endDate) {
                wl.temporalConstraint.endDate = new Date(wl.temporalConstraint.endDate)
            }
        }
        if (wl.children.length > 0) {
            recursiveParseDate(wl.children)
        }
    })
};

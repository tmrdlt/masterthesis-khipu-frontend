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
            if (list.uuid == listUUidToReorder) {
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
        if (lists[i].uuid == droppableSource.droppableId) {
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
        if (list.uuid == droppableDestination.droppableId) {
            list.children.splice(droppableDestination.index, 0, elementToMove);
        } else {
            recursiveInsert(list.children, droppableDestination, elementToMove)
        }
    })
}

// Use someday
export const isOnSameLevel = (lists: Array<WorkflowList>, list1Uuid: string, list2Uuid: string): boolean => {
    if (lists.filter(list => (list.uuid == list1Uuid) || (list.uuid == list2Uuid)).length == 2) {
        return true
    } else {
        lists.forEach(list => {
            isOnSameLevel(list.children, list1Uuid, list2Uuid)
        })
    }
}

/**
 * Function to determine if in an Array of WorkflowList a child list is really a child list of some parent list
 */
export const recursiveIsChildOfParent = (lists: Array<WorkflowList>, potentialChildUuid: string, potentialParentUuid: string): boolean => {
    let isChildOfParent = false;
    lists.some(list => {
        if (list.uuid == potentialParentUuid && list.children.length == 0) {
            return;
        } else if (list.uuid == potentialParentUuid && list.children.length > 0) {
            const contains = recursiveContains(list.children, potentialChildUuid);
            console.log("recursiveContains", contains);
            isChildOfParent = contains;
            return;
        } else {
            isChildOfParent = recursiveIsChildOfParent(list.children, potentialChildUuid, potentialParentUuid);
        }
    })
    return isChildOfParent
}

/**
 * Helper function to check if an Array of WorkflowList contains a specific listUuid
 * @param lists: Array in which to search for
 * @param listUuid: Uuid to search for
 */
const recursiveContains = (lists: Array<WorkflowList>, listUuid: string): boolean => {

    let contains = false;
    lists.some(list => {
        if (list.uuid == listUuid) {
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

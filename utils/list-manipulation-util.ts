import {WorkflowList} from "utils/models";
import {DraggableLocation} from "react-beautiful-dnd";
import {element} from "prop-types";

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

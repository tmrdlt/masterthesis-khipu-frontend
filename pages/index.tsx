import React, {FunctionComponent, useEffect, useState} from "react";
import {DragDropContext, Draggable, Droppable, DropResult, DraggableLocation} from "react-beautiful-dnd";
import {initialData} from "utils/initial-data";
import axios from "axios";
import {WorkflowList} from "utils/models";
import BoardComponent from "components/BoardComponent";


/**
 * Reorder items inside a list.
 */
const reorder = (items: Array<WorkflowList>, startIndex: number, endIndex: number) => {
    const [removed] = items.splice(startIndex, 1);
    items.splice(endIndex, 0, removed);
    return items;
};

/**
 * Recursively reorder items inside a list.
 */
const recursiveReorder = (lists: Array<WorkflowList>,
                          listUUidToReorder: string,
                          startIndex: number,
                          endIndex: number) => {
    lists.forEach(list => {
        if (list.uuid == listUUidToReorder) {
            const [removed] = list.children.splice(startIndex, 1);
            list.children.splice(endIndex, 0, removed);
        } else {
            recursiveReorder(list.children, listUUidToReorder, startIndex, endIndex)
        }
    })
};

/**
 * Move an item from one list to another list.
 */
const move = (sourceItems: Array<WorkflowList>,
              destinationItems: Array<WorkflowList>,
              droppableSource: DraggableLocation,
              droppableDestination: DraggableLocation): [Array<WorkflowList>, Array<WorkflowList>] => {
    const sourceClone = Array.from(sourceItems);
    const destinationClone = Array.from(destinationItems);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destinationClone.splice(droppableDestination.index, 0, removed);

    return [sourceClone, destinationClone];
};

/**
 * Recursively move an item from one list to another list.
 */
const recursiveMove = (lists: Array<WorkflowList>,
                       elementToMoveUuid: string,
                       droppableSource: DraggableLocation,
                       droppableDestination: DraggableLocation) => {

    const elementToMove: WorkflowList = recursiveFind(lists, elementToMoveUuid)
    recursiveRemove(lists, droppableSource);
    recursiveInsert(lists, droppableDestination, elementToMove);
};

const recursiveFind = (lists: Array<WorkflowList>, elementToMoveUuid: string): WorkflowList => {
    for (let i = 0; i < lists.length; i++) {
        if (lists[i].uuid == elementToMoveUuid) {
            return lists[i]
        }
        const found = recursiveFind(lists[i].children, elementToMoveUuid)
        if (found) {
            return found;
        }
    }
}
const recursiveRemove = (lists: Array<WorkflowList>,
                         droppableSource: DraggableLocation) => {
    lists.forEach(list => {
        if (list.uuid == droppableSource.droppableId) {
            list.children.splice(droppableSource.index, 1);
        } else {
            recursiveRemove(list.children, droppableSource)
        }
    })
}

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


const Home: FunctionComponent = (): JSX.Element => {

    const [state, setState] = useState(initialData);

    useEffect(() => {
        //getWorkflowLists();
    }, []);

    const getWorkflowLists = async () => {
        axios.get('http://localhost:5001/workflowList')
            .then(function (response) {
                const workflowLists: Array<WorkflowList> = response.data;
                console.log(workflowLists);
                setState(workflowLists);
            }).catch(function (error) {
            console.log(error);
        });
    }

    function onDragEnd(result: DropResult) {
        const {destination, source, draggableId} = result;

        if (!destination) {
            return;
        }

        const sourceDroppableId: string = source.droppableId;
        const destinationDroppableId: string = destination.droppableId;

        if (sourceDroppableId === destinationDroppableId) {
            let newState = [...state]
            recursiveReorder(newState, sourceDroppableId, source.index, destination.index)
            setState(newState);
        } else {
            let newState = [...state]
            recursiveMove(newState, draggableId, source, destination)
            setState(newState);
        }
    }

    return (
        <div style={{display: "flex"}}>
            <DragDropContext onDragEnd={onDragEnd}>
                <div>
                    {state.map((board, index) => (
                        <BoardComponent key={index} board={board} index={index}/>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Home

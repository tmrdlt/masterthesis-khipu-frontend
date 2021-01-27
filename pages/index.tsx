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
                       droppableSource: DraggableLocation,
                       droppableDestination: DraggableLocation) => {

    const elementToMove: WorkflowList = recursiveRemove(lists, droppableSource);
    recursiveInsert(lists, droppableDestination, elementToMove);
};

const recursiveRemove = (lists: Array<WorkflowList>, droppableSource: DraggableLocation): WorkflowList => {
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
        const {destination, source} = result;

        if (!destination) {
            return;
        }

        const sourceDroppableId: string = source.droppableId;
        const destinationDroppableId: string = destination.droppableId;

        if (sourceDroppableId === destinationDroppableId) {
            // It's a REORDER action
            let newState = [...state]
            recursiveReorder(newState, sourceDroppableId, source.index, destination.index)
            setState(newState);
        } else {
            // It's a MOVE action
            let newState = [...state]
            recursiveMove(newState, source, destination)
            setState(newState);
        }
    }

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                {state.map((board, index) => (
                    <BoardComponent key={index} board={board} index={index}/>
                ))}
            </DragDropContext>
        </div>
    );
};

export default Home

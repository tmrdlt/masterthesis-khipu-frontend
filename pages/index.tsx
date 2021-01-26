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
const recursiveReorder = (lists: Array<WorkflowList>, listUUidToReorder: string, startIndex: number, endIndex: number) => {
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
            let newState = [...state]
            recursiveReorder(newState, sourceDroppableId, source.index, destination.index)
            setState(newState);
        } else {
            const sourceList = state.find(list => list.uuid == sourceDroppableId);
            const destinationList = state.find(list => list.uuid == destinationDroppableId);
            const sourceListIndex = state.indexOf(sourceList);
            const destinationListIndex = state.indexOf(destinationList);

            const result = move(sourceList.children, destinationList.children, source, destination);
            // Make shallow copy
            const newState = [...state];
            newState[sourceListIndex].children = result[0];
            newState[destinationListIndex].children = result[1];

            setState(newState);
        }
    }

    return (
        // TODO move into components
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

import React, {FunctionComponent, useEffect, useState} from "react";
import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import {initialData} from "utils/initial-data";
import {CreateWorkflowListEntity} from "utils/models";
import BoardComponent from "components/board-component";
import {recursiveMove, recursiveReorder} from "utils/list-manipulation-util";
import {deleteWorkflowList, getWorkflowLists, postWorkflowList} from "utils/workflow-api";

const Home: FunctionComponent = (): JSX.Element => {

    const [state, setState] = useState(initialData);

    useEffect(() => {
        init();
    }, []);

    const init = () => {
        getWorkflowLists().then(workflowLists => {
            if (workflowLists) {
                setState(workflowLists)
            }
        })
    }

    function onDragEnd(result: DropResult) {
        const {destination, source} = result;

        console.log("OnDragEnd", result);

        // Do nothing if invalid drag
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

    const createWorkflowList = (createWorkflowListEntity: CreateWorkflowListEntity) => {
        postWorkflowList(createWorkflowListEntity)
            .then(res => {
                if (res) {
                    getWorkflowLists().then(workflowLists => {
                        if (workflowLists) {
                            setState(workflowLists)
                        }
                    })
                }
            });
    }

    const removeWorkflowList = (uuid: string) => {
        deleteWorkflowList(uuid)
            .then(res => {
                if (res) {
                    getWorkflowLists().then(workflowLists => {
                        if (workflowLists) {
                            setState(workflowLists)
                        }
                    })
                }
            });
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    createWorkflowList({
                        title: "board",
                        description: "board"
                    })
                }}
            >Add board
            </button>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="HIGHEST_DROPPABLE" type="HIGHEST_DROPPABLE">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef}
                             {...provided.droppableProps}
                        >
                            {state.map((board, index) => (
                                <BoardComponent key={index} board={board} index={index}
                                                createWorkflowList={createWorkflowList}
                                                removeWorkflowList={removeWorkflowList}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default Home

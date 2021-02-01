import React, {FunctionComponent, useEffect, useState} from "react";
import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import {initialData} from "utils/initial-data";
import {CreateWorkflowListEntity, WorkflowListType} from "utils/models";
import BoardComponent from "components/board-component";
import {recursiveMove, recursiveReorder} from "utils/list-manipulation-util";
import {deleteWorkflowList, getWorkflowLists, postWorkflowList} from "utils/workflow-api";
import CreateWorkflowListModal from "components/create-workflow-list-modal";

const Home: FunctionComponent = (): JSX.Element => {

    const [state, setState] = useState(initialData);
    const [showModal, setShowModal] = useState(false);

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

    const createWorkflowList = async (createWorkflowListEntity: CreateWorkflowListEntity) => {
        let newCreateWorkflowListEntity: CreateWorkflowListEntity;
        if (createWorkflowListEntity.description == "") {
            newCreateWorkflowListEntity = {...createWorkflowListEntity, description: null}
        } else {
            newCreateWorkflowListEntity = createWorkflowListEntity
        }
        postWorkflowList(newCreateWorkflowListEntity)
            .then(res => {
                if (res) {
                    getWorkflowLists().then(workflowLists => {
                        if (workflowLists) {
                            setState(workflowLists)
                        }
                    })
                }
                return res
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

    const openModal = () => {
        setShowModal(true);
    }
    const closeModal = () => {
        setShowModal(false);
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    openModal()
                }}
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded m-1"
            >Add board
            </button>
            <CreateWorkflowListModal show={showModal}
                                     closeModal={closeModal}
                                     createType={WorkflowListType.Board}
                                     parentUuid={null}
                                     createWorkflowList={createWorkflowList}/>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="HIGHEST_DROPPABLE" type="HIGHEST_DROPPABLE">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef}
                             {...provided.droppableProps}
                        >
                            {state.map((board, index) => (
                                <BoardComponent key={index}
                                                index={index}
                                                board={board}
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

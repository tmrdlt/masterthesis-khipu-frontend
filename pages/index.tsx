import React, {FunctionComponent, useEffect, useState} from "react";
import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import {initialData} from "utils/initial-data";
import {
    ConvertWorkflowListEntity,
    CreateWorkflowListEntity,
    UpdateWorkflowListEntity,
    WorkflowList,
    WorkflowListType
} from "utils/models";
import BoardComponent from "components/board-component";
import {isInsideParent, isSameLevelOfSameParent, recursiveMove, recursiveReorder} from "utils/list-util";
import {
    deleteWorkflowList,
    getWorkflowLists,
    postWorkflowList,
    postWorkflowListConvert,
    postWorkflowListMove,
    putWorkflowList
} from "utils/workflow-api";
import CreateWorkflowListModal from "components/create-workflowlist-modal";
import ListComponent from "components/list-component";
import ItemComponent from "components/item-component";
import {getDroppableStyle} from "utils/style-elements";
import DropButton from "components/drop-button";

const Home: FunctionComponent = (): JSX.Element => {

    const [state, setState] = useState(initialData);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const initWorkflowListToMove: WorkflowList | null = null;
    const [workflowListToMove, setWorkflowListToMove] = useState(initWorkflowListToMove);

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
        const {destination, source, draggableId} = result;

        console.log("OnDragEnd", result);

        // Do nothing if invalid drag
        if (!destination || draggableId === destination.droppableId) {
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

            let newParentUuid = null
            if (!(destinationDroppableId === "ROOT")) {
                newParentUuid = destinationDroppableId;
            }
            postWorkflowListMove(draggableId, {newParentUuid: newParentUuid}).then(res => {
                getWorkflowLists().then(workflowLists => {
                    if (workflowLists) {
                        setState(workflowLists)
                    }
                })
            })
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

    const modifyWorkflowList = async (workflowListUuid: string, updateWorkflowListEntity: UpdateWorkflowListEntity) => {
        let newUpdateWorkflowListEntity: UpdateWorkflowListEntity;
        if (updateWorkflowListEntity.newDescription == "") {
            newUpdateWorkflowListEntity = {...updateWorkflowListEntity, newDescription: null}
        } else {
            newUpdateWorkflowListEntity = updateWorkflowListEntity
        }
        putWorkflowList(workflowListUuid, newUpdateWorkflowListEntity)
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

    const convertWorkflowList = (uuid: string, convertWorkflowListEntity: ConvertWorkflowListEntity) => {
        postWorkflowListConvert(uuid, convertWorkflowListEntity)
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

    const moveWorkflowList = (destinationWorkflowList?: WorkflowList) => {
        let newParentUuid = null
        // We are not on root
        if (destinationWorkflowList) {
            newParentUuid = destinationWorkflowList.uuid;
        }
        console.log("MOVING " + workflowListToMove.uuid + " to " + newParentUuid);
        postWorkflowListMove(workflowListToMove.uuid, {newParentUuid: newParentUuid}).then(res => {
            getWorkflowLists().then(workflowLists => {
                if (workflowLists) {
                    setState(workflowLists)
                    setWorkflowListToMove(null);
                }
            })
        })
    }

    const openModal = () => {
        setShowCreateModal(true);
    }
    const closeModal = () => {
        setShowCreateModal(false);
    }

    const selectWorkflowListToMove = (wl: WorkflowList) => {
        setWorkflowListToMove(wl);
    }

    const showDropButton = (destinationToDropOn?: WorkflowList) => {
        // Move modal is not open do not show drop button
        if (!workflowListToMove) {
            return false;
        } else {
            // Move Modal is Open

            // The following would be illegal moves or moves that doesn't make sense
            // Destination is already the list the element is in
            const destinationIsSameLevelAsElementToMove = isSameLevelOfSameParent(state, destinationToDropOn, workflowListToMove)
            // The destination would be inside the element we want to move
            const destinationInsideElementToMove = isInsideParent(workflowListToMove, destinationToDropOn)
            // The destination would be exactly the element we want to move
            const destinationIsElementToMove = destinationToDropOn && (destinationToDropOn.uuid == workflowListToMove.uuid)

            // Show drop button only if all three are false
            return !destinationIsSameLevelAsElementToMove && !destinationInsideElementToMove && !destinationIsElementToMove;
        }
    }

    return (
        <div className="bg-gray-200 h-screen p-3">
            <button
                type="button"
                onClick={() => {
                    openModal()
                }}
                className="bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500 hover:border-transparent rounded m-1 mb-3 w-8 h-8"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
            </button>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="ROOT" type="ROOT">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef}
                             style={getDroppableStyle(snapshot.isDraggingOver)}
                             {...provided.droppableProps}
                             className="p-1"
                        >
                            {state.map((wl, index) => {
                                if (wl.usageType == WorkflowListType.BOARD) {
                                    return (
                                        <BoardComponent key={index}
                                                        index={index}
                                                        workflowList={wl}
                                                        createWorkflowList={createWorkflowList}
                                                        modifyWorkflowList={modifyWorkflowList}
                                                        removeWorkflowList={removeWorkflowList}
                                                        convertWorkflowList={convertWorkflowList}
                                                        moveWorkflowList={moveWorkflowList}
                                                        selectWorkflowListToMove={selectWorkflowListToMove}
                                                        showDropButton={showDropButton}
                                        />
                                    )
                                } else if (wl.usageType == WorkflowListType.LIST) {
                                    return (
                                        <ListComponent key={index}
                                                       index={index}
                                                       workflowList={wl}
                                                       createWorkflowList={createWorkflowList}
                                                       modifyWorkflowList={modifyWorkflowList}
                                                       removeWorkflowList={removeWorkflowList}
                                                       convertWorkflowList={convertWorkflowList}
                                                       moveWorkflowList={moveWorkflowList}
                                                       selectWorkflowListToMove={selectWorkflowListToMove}
                                                       showDropButton={showDropButton}
                                        />
                                    )
                                } else {
                                    return (
                                        <ItemComponent key={index}
                                                       index={index}
                                                       workflowList={wl}
                                                       modifyWorkflowList={modifyWorkflowList}
                                                       removeWorkflowList={removeWorkflowList}
                                                       selectWorkflowListToMove={selectWorkflowListToMove}
                                        />
                                    )
                                }
                            })}
                            <DropButton workflowList={null}
                                        moveWorkflowList={moveWorkflowList}
                                        showDropButton={showDropButton}/>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <CreateWorkflowListModal show={showCreateModal}
                                     closeModal={closeModal}
                                     createType={WorkflowListType.BOARD}
                                     parentUuid={null}
                                     createWorkflowList={createWorkflowList}/>
        </div>
    );
};

export default Home

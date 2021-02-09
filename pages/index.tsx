import React, {FunctionComponent, useEffect, useState} from "react";
import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import {initialData} from "utils/initial-data";
import {
    ConvertWorkflowListEntity,
    CreateWorkflowListEntity,
    UpdateWorkflowListEntity,
    WorkflowListType
} from "utils/models";
import BoardComponent from "components/board-component";
import {recursiveMove, recursiveReorder} from "utils/list-manipulation-util";
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

const Home: FunctionComponent = (): JSX.Element => {

    const [state, setState] = useState(initialData);
    const [showCreateModal, setShowCreateModal] = useState(false);

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

    const openModal = () => {
        setShowCreateModal(true);
    }
    const closeModal = () => {
        setShowCreateModal(false);
    }

    return (
        <div className="bg-gray-200 h-screen">
            <button
                type="button"
                onClick={() => {
                    openModal()
                }}
                className="bg-transparent hover:bg-blue-500 text-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded m-2"
            >Add board
            </button>
            <CreateWorkflowListModal show={showCreateModal}
                                     closeModal={closeModal}
                                     createType={WorkflowListType.BOARD}
                                     parentUuid={null}
                                     createWorkflowList={createWorkflowList}/>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="ROOT" type="LIST">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef}
                             style={getDroppableStyle(snapshot.isDraggingOver)}
                             {...provided.droppableProps}
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
                                        />
                                    )
                                } else {
                                    return (
                                        <ItemComponent key={index}
                                                       index={index}
                                                       workflowList={wl}
                                                       modifyWorkflowList={modifyWorkflowList}
                                                       removeWorkflowList={removeWorkflowList}/>
                                    )
                                }
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default Home

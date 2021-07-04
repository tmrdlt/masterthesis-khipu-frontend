import {WorkflowList, WorkflowListSimple, workflowListToWorkflowListSimple, WorkflowListType} from "utils/models";
import {Draggable, Droppable} from "react-beautiful-dnd";
import ListComponent from "components/list-component";
import React, {useEffect, useState} from "react";
import CreateWorkflowListModal from "components/modals/create-workflowlist-modal";
import ItemComponent from "components/item-component";
import {getDroppableStyle} from "utils/style-elements";
import MoveWorkflowListModal from "components/modals/move-workflowlist-modal";
import DropButton from "components/drop-button";
import ButtonsMenu from "components/buttons-menu";
import {formatDate} from "utils/date-util";
import ModifyBoardModal from "components/modals/modify-board-modal";

interface IBoardProps {
    index: number
    workflowList: WorkflowList
    userApiId: string
    createWorkflowList
    modifyWorkflowList
    removeWorkflowList
    convertWorkflowList
    moveWorkflowList
    workflowListToMove
    selectWorkflowListToMove
    showDropButton
    modifyTemporalResource
    modifyGenericResources
}

const BoardComponent = ({
                            index,
                            workflowList,
                            userApiId,
                            createWorkflowList,
                            modifyWorkflowList,
                            removeWorkflowList,
                            convertWorkflowList,
                            moveWorkflowList,
                            workflowListToMove,
                            selectWorkflowListToMove,
                            showDropButton,
                            modifyTemporalResource,
                            modifyGenericResources
                        }: IBoardProps): JSX.Element => {
    // STATE
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showModifyModal, setShowModifyModal] = useState(false);
    const [showMoveModal, setShowMoveModal] = useState(false);

    useEffect(() => {
        if (!workflowListToMove) {
            closeMoveModal();
        }
    }, [workflowListToMove])

    // DYNAMIC CLASSES
    const moveClassName = showMoveModal ? " z-20 relative transition-all" : "";

    // FUNCTIONS
    const openCreateModal = () => {
        setShowCreateModal(true);
    }
    const closeCreateModal = () => {
        setShowCreateModal(false);
    }
    const openModifyModal = () => {
        setShowModifyModal(true);
    }
    const closeModifyModal = () => {
        setShowModifyModal(false);
    }
    const openMoveModal = () => {
        setShowMoveModal(true);
    }
    const closeMoveModal = () => {
        setShowMoveModal(false);
    }

    const getTemporalResourceText = (): string => {
        return workflowList.temporalResource
        && workflowList.temporalResource.endDate ? "Board due on: " + formatDate(workflowList.temporalResource.endDate) :
            "No due date configured"
    }

    return (
        <Draggable
            key={workflowList.apiId}
            draggableId={workflowList.apiId}
            index={index}
        >
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}
                     className="mb-2 mr-2">
                    <div className={"bg-blue-300 border border-gray-500 rounded shadow p-1" + moveClassName}>
                        <div className="flex place-content-between">
                            <div className="grid w-full m-1 hover:bg-blue-200"
                                 {...provided.dragHandleProps}
                            >
                                <span className="font-bold">{workflowList.title} </span>
                                {workflowList.isTemporalConstraintBoard &&
                                <div className="inline-flex items-center text-xs">
                                    <div className="w-3 h-3 mr-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    {getTemporalResourceText()}
                                </div>
                                }
                            </div>
                            <ButtonsMenu workflowList={workflowList}
                                         removeWorkflowList={removeWorkflowList}
                                         convertWorkflowList={convertWorkflowList}
                                         selectWorkflowListToMove={selectWorkflowListToMove}
                                         openCreateModal={openCreateModal}
                                         openModifyModal={openModifyModal}
                                         openMoveModal={openMoveModal}
                            />
                        </div>

                        <div className="m-1 text-sm whitespace-pre">
                            {workflowList.description}
                        </div>

                        <Droppable droppableId={workflowList.apiId} direction="horizontal" type={workflowList.level}>
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}
                                     style={getDroppableStyle(snapshot.isDraggingOver)}
                                     {...provided.droppableProps}
                                     className="p-1">
                                    <div className="w-full h-auto min-h-full flex justify-start">
                                        {workflowList.children.map((wl, index) => {
                                            if (wl.usageType == WorkflowListType.BOARD) {
                                                return (
                                                    <BoardComponent key={index}
                                                                    index={index}
                                                                    workflowList={wl}
                                                                    userApiId={userApiId}
                                                                    createWorkflowList={createWorkflowList}
                                                                    modifyWorkflowList={modifyWorkflowList}
                                                                    removeWorkflowList={removeWorkflowList}
                                                                    convertWorkflowList={convertWorkflowList}
                                                                    moveWorkflowList={moveWorkflowList}
                                                                    workflowListToMove={workflowListToMove}
                                                                    selectWorkflowListToMove={selectWorkflowListToMove}
                                                                    showDropButton={showDropButton}
                                                                    modifyTemporalResource={modifyTemporalResource}
                                                                    modifyGenericResources={modifyGenericResources}
                                                    />
                                                )
                                            } else if (wl.usageType == WorkflowListType.LIST) {
                                                return (
                                                    <ListComponent key={index}
                                                                   index={index}
                                                                   workflowList={wl}
                                                                   userApiId={userApiId}
                                                                   isInsideTemporalConstraintBoard={workflowList.isTemporalConstraintBoard}
                                                                   createWorkflowList={createWorkflowList}
                                                                   modifyWorkflowList={modifyWorkflowList}
                                                                   removeWorkflowList={removeWorkflowList}
                                                                   convertWorkflowList={convertWorkflowList}
                                                                   moveWorkflowList={moveWorkflowList}
                                                                   workflowListToMove={workflowListToMove}
                                                                   selectWorkflowListToMove={selectWorkflowListToMove}
                                                                   showDropButton={showDropButton}
                                                                   modifyTemporalResource={modifyTemporalResource}
                                                                   modifyGenericResources={modifyGenericResources}
                                                    />
                                                )
                                            } else {
                                                return (
                                                    <ItemComponent key={index}
                                                                   index={index}
                                                                   workflowList={wl}
                                                                   userApiId={userApiId}
                                                                   isInsideTemporalConstraintBoard={workflowList.isTemporalConstraintBoard}
                                                                   modifyWorkflowList={modifyWorkflowList}
                                                                   removeWorkflowList={removeWorkflowList}
                                                                   workflowListToMove={workflowListToMove}
                                                                   selectWorkflowListToMove={selectWorkflowListToMove}
                                                                   modifyTemporalResource={modifyTemporalResource}
                                                                   modifyGenericResources={modifyGenericResources}
                                                    />
                                                )
                                            }
                                        })}
                                        <DropButton workflowList={workflowList}
                                                    moveWorkflowList={moveWorkflowList}
                                                    showDropButton={showDropButton}/>
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    </div>
                    <CreateWorkflowListModal show={showCreateModal}
                                             closeModal={closeCreateModal}
                                             createType={WorkflowListType.LIST}
                                             parentUuid={workflowList.apiId}
                                             userApiId={userApiId}
                                             createWorkflowList={createWorkflowList}
                    />
                    <ModifyBoardModal show={showModifyModal}
                                      closeModal={closeModifyModal}
                                      workflowList={workflowList}
                                      modifyWorkflowList={modifyWorkflowList}
                                      setTemporalResource={modifyTemporalResource}
                    />
                    <MoveWorkflowListModal show={showMoveModal}
                                           closeModal={closeMoveModal}
                                           selectWorkflowListToMove={selectWorkflowListToMove}
                    />
                </div>
            )}
        </Draggable>
    )
}

export default BoardComponent

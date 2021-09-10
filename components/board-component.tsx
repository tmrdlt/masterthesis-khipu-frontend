import {WorkflowList, WorkflowListType} from "utils/models";
import {Draggable, Droppable} from "react-beautiful-dnd";
import ListComponent from "components/list-component";
import React, {useEffect, useState} from "react";
import CreateWorkflowListModal from "components/modals/create-workflowlist-modal";
import ItemComponent from "components/item-component";
import {getDroppableStyle} from "utils/style-elements";
import MoveWorkflowListModal from "components/modals/move-workflowlist-modal";
import DropButton from "components/drop-button";
import ButtonsMenu from "components/buttons-menu";
import {formatDate, formatDuration} from "utils/date-util";
import ModifyBoardModal from "components/modals/modify-board-modal";
import {usePopperTooltip} from "react-popper-tooltip";

interface IBoardProps {
    index: number
    workflowList: WorkflowList
    userApiId: string
    workflowListToMove: WorkflowList
    createWorkflowList
    modifyWorkflowList
    removeWorkflowList
    convertWorkflowList
    moveWorkflowList
    selectWorkflowListToMove
    showDropButton
    modifyResources
    getTemporalQueryResult
}

const BoardComponent = ({
                            index,
                            workflowList,
                            userApiId,
                            workflowListToMove,
                            createWorkflowList,
                            modifyWorkflowList,
                            removeWorkflowList,
                            convertWorkflowList,
                            moveWorkflowList,
                            selectWorkflowListToMove,
                            showDropButton,
                            modifyResources,
                            getTemporalQueryResult
                        }: IBoardProps): JSX.Element => {
    // STATE
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showModifyModal, setShowModifyModal] = useState(false);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const {
        getArrowProps,
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible,
    } = usePopperTooltip();

    useEffect(() => {
        if (!workflowListToMove) {
            closeMoveModal();
        }
    }, [workflowListToMove])

    // DYNAMIC CLASSES
    const moveClassName = showMoveModal ? " z-20 relative transition-all" : "";
    const temporalQueryLabelColor = workflowList.temporalQueryResult != null ? workflowList.temporalQueryResult.dueDateKept ? " bg-green-500" : " bg-red-500" : "";

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
                            <div className="flex flex-col items-center">
                                <ButtonsMenu workflowList={workflowList}
                                             removeWorkflowList={removeWorkflowList}
                                             convertWorkflowList={convertWorkflowList}
                                             selectWorkflowListToMove={selectWorkflowListToMove}
                                             openCreateModal={openCreateModal}
                                             openModifyModal={openModifyModal}
                                             openMoveModal={openMoveModal}
                                             getTemporalQueryResult={getTemporalQueryResult}
                                />
                                {workflowList.temporalQueryResult != null &&
                                <div>
                                    <div
                                        className={"border border-gray-500 rounded shadow p-1 text-xs text-center" + temporalQueryLabelColor}
                                        ref={setTriggerRef}>
                                        Query result
                                    </div>
                                    {visible &&
                                    <div
                                        className="bg-blue-900 border border-gray-500 rounded shadow p-1 text-xs text-center"
                                        ref={setTooltipRef}
                                        {...getTooltipProps({className: 'tooltip-container text-xs'})}>
                                        <span>Calculated start date: {formatDate(workflowList.temporalQueryResult.startedAt)}</span>
                                        <span>Calculated finish date: {formatDate(workflowList.temporalQueryResult.finishedAt)}</span>
                                        <span>Calculated total remaining duration: {formatDuration(workflowList.temporalQueryResult.duration)}</span>
                                        {workflowList.temporalQueryResult.dueDate != null &&
                                        <span>Does {workflowList.temporalQueryResult.dueDateKept ? "" : "NOT "}comply with due date</span>
                                        }
                                        <div {...getArrowProps({className: 'tooltip-arrow'})} />
                                    </div>
                                    }
                                </div>
                                }

                            </div>
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
                                                                    workflowListToMove={workflowListToMove}
                                                                    createWorkflowList={createWorkflowList}
                                                                    modifyWorkflowList={modifyWorkflowList}
                                                                    removeWorkflowList={removeWorkflowList}
                                                                    convertWorkflowList={convertWorkflowList}
                                                                    moveWorkflowList={moveWorkflowList}
                                                                    selectWorkflowListToMove={selectWorkflowListToMove}
                                                                    showDropButton={showDropButton}
                                                                    modifyResources={modifyResources}
                                                                    getTemporalQueryResult={getTemporalQueryResult}
                                                    />
                                                )
                                            } else if (wl.usageType == WorkflowListType.LIST) {
                                                return (
                                                    <ListComponent key={index}
                                                                   index={index}
                                                                   workflowList={wl}
                                                                   userApiId={userApiId}
                                                                   isInsideTemporalConstraintBoard={workflowList.isTemporalConstraintBoard}
                                                                   workflowListToMove={workflowListToMove}
                                                                   createWorkflowList={createWorkflowList}
                                                                   modifyWorkflowList={modifyWorkflowList}
                                                                   removeWorkflowList={removeWorkflowList}
                                                                   convertWorkflowList={convertWorkflowList}
                                                                   moveWorkflowList={moveWorkflowList}
                                                                   selectWorkflowListToMove={selectWorkflowListToMove}
                                                                   showDropButton={showDropButton}
                                                                   modifyResources={modifyResources}
                                                                   getTemporalQueryResult={getTemporalQueryResult}
                                                    />
                                                )
                                            } else {
                                                return (
                                                    <ItemComponent key={index}
                                                                   index={index}
                                                                   workflowList={wl}
                                                                   userApiId={userApiId}
                                                                   isInsideTemporalConstraintBoard={workflowList.isTemporalConstraintBoard}
                                                                   workflowListToMove={workflowListToMove}
                                                                   modifyWorkflowList={modifyWorkflowList}
                                                                   removeWorkflowList={removeWorkflowList}
                                                                   selectWorkflowListToMove={selectWorkflowListToMove}
                                                                   modifyResources={modifyResources}
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
                                      modifyResources={modifyResources}
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

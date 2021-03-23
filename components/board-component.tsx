import {WorkflowList, workflowListToWorkflowListSimple, WorkflowListType} from "utils/models";
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
    createWorkflowList
    modifyWorkflowList
    removeWorkflowList
    convertWorkflowList
    moveWorkflowList
    workflowListToMove
    selectWorkflowListToMove
    showDropButton
    setTemporalConstraint
}

const BoardComponent = ({
                            index,
                            workflowList,
                            createWorkflowList,
                            modifyWorkflowList,
                            removeWorkflowList,
                            convertWorkflowList,
                            moveWorkflowList,
                            workflowListToMove,
                            selectWorkflowListToMove,
                            showDropButton,
                            setTemporalConstraint
                        }: IBoardProps): JSX.Element => {

    const [showCreateModal, setShowCreateModal] = useState(false);
    const openCreateModal = () => {
        setShowCreateModal(true);
    }
    const closeCreateModal = () => {
        setShowCreateModal(false);
    }

    const [showModifyModal, setShowModifyModal] = useState(false)
    const openModifyModal = () => {
        setShowModifyModal(true);
    }
    const closeModifyModal = () => {
        setShowModifyModal(false);
    }

    const [showMoveModal, setShowMoveModal] = useState(false)
    const openMoveModal = () => {
        setShowMoveModal(true);
    }
    const closeMoveModal = () => {
        setShowMoveModal(false);
    }

    useEffect(() => {
        if (!workflowListToMove) {
            closeMoveModal();
        }
    }, [workflowListToMove])

    const moveClassName = showMoveModal ? " z-20 relative transition-all" : "";

    const simpleChildLists = workflowList.children.filter(wl => wl.usageType == WorkflowListType.LIST).map(wl => workflowListToWorkflowListSimple(wl))

    return (
        <Draggable
            key={workflowList.uuid}
            draggableId={workflowList.uuid}
            index={index}
        >
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}
                     className="mb-2 mr-2">
                    <div className={"bg-blue-300 border border-gray-500 rounded shadow p-1" + moveClassName}>
                        <div className="grid grid-cols-2 hover:bg-blue-200"
                             {...provided.dragHandleProps}>
                            <div className="w-full font-bold m-1">{workflowList.title}</div>
                            <ButtonsMenu workflowList={workflowList}
                                         removeWorkflowList={removeWorkflowList}
                                         convertWorkflowList={convertWorkflowList}
                                         selectWorkflowListToMove={selectWorkflowListToMove}
                                         openCreateModal={openCreateModal}
                                         openModifyModal={openModifyModal}
                                         openMoveModal={openMoveModal}
                            />
                        </div>
                        <div className="flex place-content-between">
                            <div className="m-1 text-sm">{workflowList.description}</div>
                            {workflowList.isTemporalConstraintBoard &&
                            <div
                                className="m-1 text-sm">{workflowList.temporalConstraint
                            && workflowList.temporalConstraint.dueDate ? "Board due on: " + formatDate(workflowList.temporalConstraint.dueDate) :
                                "No due date for board configured"}</div>
                            }
                        </div>

                        <Droppable droppableId={workflowList.uuid} direction="horizontal" type={workflowList.level}>
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
                                                                    createWorkflowList={createWorkflowList}
                                                                    modifyWorkflowList={modifyWorkflowList}
                                                                    removeWorkflowList={removeWorkflowList}
                                                                    convertWorkflowList={convertWorkflowList}
                                                                    moveWorkflowList={moveWorkflowList}
                                                                    workflowListToMove={workflowListToMove}
                                                                    selectWorkflowListToMove={selectWorkflowListToMove}
                                                                    showDropButton={showDropButton}
                                                                    setTemporalConstraint={setTemporalConstraint}
                                                    />
                                                )
                                            } else if (wl.usageType == WorkflowListType.LIST) {
                                                return (
                                                    <ListComponent key={index}
                                                                   index={index}
                                                                   workflowList={wl}
                                                                   isInsideTemporalConstraintBoard={workflowList.isTemporalConstraintBoard}
                                                                   boardSimpleLists={simpleChildLists}
                                                                   createWorkflowList={createWorkflowList}
                                                                   modifyWorkflowList={modifyWorkflowList}
                                                                   removeWorkflowList={removeWorkflowList}
                                                                   convertWorkflowList={convertWorkflowList}
                                                                   moveWorkflowList={moveWorkflowList}
                                                                   workflowListToMove={workflowListToMove}
                                                                   selectWorkflowListToMove={selectWorkflowListToMove}
                                                                   showDropButton={showDropButton}
                                                                   setTemporalConstraint={setTemporalConstraint}
                                                    />
                                                )
                                            } else {
                                                return (
                                                    <ItemComponent key={index}
                                                                   index={index}
                                                                   workflowList={wl}
                                                                   isInsideTemporalConstraintBoard={workflowList.isTemporalConstraintBoard}
                                                                   boardSimpleLists={simpleChildLists}
                                                                   modifyWorkflowList={modifyWorkflowList}
                                                                   removeWorkflowList={removeWorkflowList}
                                                                   workflowListToMove={workflowListToMove}
                                                                   selectWorkflowListToMove={selectWorkflowListToMove}
                                                                   setTemporalConstraint={setTemporalConstraint}/>
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
                                             parentUuid={workflowList.uuid}
                                             createWorkflowList={createWorkflowList}
                    />
                    <ModifyBoardModal show={showModifyModal}
                                      closeModal={closeModifyModal}
                                      workflowList={workflowList}
                                      modifyWorkflowList={modifyWorkflowList}
                                      setTemporalConstraint={setTemporalConstraint}
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

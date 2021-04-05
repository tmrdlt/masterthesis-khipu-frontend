import {Draggable, Droppable} from "react-beautiful-dnd";
import React, {useEffect, useState} from "react";
import {WorkflowList, WorkflowListSimple, WorkflowListType} from "utils/models";
import ItemComponent from "components/item-component";
import CreateWorkflowListModal from "components/modals/create-workflowlist-modal";
import ModifyListModal from "components/modals/modify-list-modal";
import BoardComponent from "components/board-component";
import {getDroppableStyle} from "utils/style-elements";
import MoveWorkflowListModal from "components/modals/move-workflowlist-modal";
import DropButton from "components/drop-button";
import ButtonsMenu from "components/buttons-menu";

interface IListProps {
    index: number
    workflowList: WorkflowList
    isInsideTemporalConstraintBoard: boolean
    boardChildLists: Array<WorkflowListSimple>
    createWorkflowList
    modifyWorkflowList
    removeWorkflowList
    convertWorkflowList
    moveWorkflowList
    workflowListToMove
    selectWorkflowListToMove
    showDropButton
    modifyTemporalConstraint
}

const ListComponent = ({
                           index,
                           workflowList,
                           isInsideTemporalConstraintBoard,
                           boardChildLists,
                           createWorkflowList,
                           modifyWorkflowList,
                           removeWorkflowList,
                           convertWorkflowList,
                           moveWorkflowList,
                           workflowListToMove,
                           selectWorkflowListToMove,
                           showDropButton,
                           modifyTemporalConstraint
                       }: IListProps): JSX.Element => {
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

    return (
        <Draggable
            key={workflowList.uuid}
            draggableId={workflowList.uuid}
            index={index}
        >
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}
                     className="mb-2 mr-2">
                    <div
                        className={"bg-red-300 border border-gray-500 rounded shadow min-w-min max-w-sm p-1" + moveClassName}>
                        <div className="flex place-content-between">
                            <div className="w-full font-bold m-1 hover:bg-red-200"
                                 {...provided.dragHandleProps}>
                                {workflowList.title}
                            </div>
                            <ButtonsMenu workflowList={workflowList}
                                         removeWorkflowList={removeWorkflowList}
                                         convertWorkflowList={convertWorkflowList}
                                         selectWorkflowListToMove={selectWorkflowListToMove}
                                         openCreateModal={openCreateModal}
                                         openModifyModal={openModifyModal}
                                         openMoveModal={openMoveModal}/>
                        </div>

                        <div className="m-1 text-sm whitespace-pre">
                            {workflowList.description}
                        </div>

                        <Droppable droppableId={workflowList.uuid} type={workflowList.level}>
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}
                                     style={getDroppableStyle(snapshot.isDraggingOver)}
                                     {...provided.droppableProps}
                                     className="p-1"
                                >
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
                                                                modifyTemporalConstraint={modifyTemporalConstraint}
                                                />
                                            )
                                        } else if (wl.usageType == WorkflowListType.LIST) {
                                            return (
                                                <ListComponent key={index}
                                                               index={index}
                                                               workflowList={wl}
                                                               isInsideTemporalConstraintBoard={isInsideTemporalConstraintBoard}
                                                               boardChildLists={boardChildLists}
                                                               createWorkflowList={createWorkflowList}
                                                               modifyWorkflowList={modifyWorkflowList}
                                                               removeWorkflowList={removeWorkflowList}
                                                               convertWorkflowList={convertWorkflowList}
                                                               moveWorkflowList={moveWorkflowList}
                                                               workflowListToMove={workflowListToMove}
                                                               selectWorkflowListToMove={selectWorkflowListToMove}
                                                               showDropButton={showDropButton}
                                                               modifyTemporalConstraint={modifyTemporalConstraint}
                                                />
                                            )
                                        } else {
                                            return (
                                                <ItemComponent key={index}
                                                               index={index}
                                                               workflowList={wl}
                                                               isInsideTemporalConstraintBoard={isInsideTemporalConstraintBoard}
                                                               boardChildLists={boardChildLists}
                                                               modifyWorkflowList={modifyWorkflowList}
                                                               removeWorkflowList={removeWorkflowList}
                                                               workflowListToMove={workflowListToMove}
                                                               selectWorkflowListToMove={selectWorkflowListToMove}
                                                               modifyTemporalConstraint={modifyTemporalConstraint}
                                                />
                                            )
                                        }
                                    })}
                                    <DropButton workflowList={workflowList}
                                                moveWorkflowList={moveWorkflowList}
                                                showDropButton={showDropButton}/>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                    <CreateWorkflowListModal show={showCreateModal}
                                             closeModal={closeCreateModal}
                                             createType={WorkflowListType.ITEM}
                                             parentUuid={workflowList.uuid}
                                             createWorkflowList={createWorkflowList}/>
                    <ModifyListModal show={showModifyModal}
                                     closeModal={closeModifyModal}
                                     workflowList={workflowList}
                                     modifyWorkflowList={modifyWorkflowList}
                    />
                    <MoveWorkflowListModal show={showMoveModal}
                                           closeModal={closeMoveModal}
                                           selectWorkflowListToMove={selectWorkflowListToMove}/>
                </div>
            )}
        </Draggable>
    )
}

export default ListComponent

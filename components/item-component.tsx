import {Draggable} from "react-beautiful-dnd";
import React, {useEffect, useState} from "react";
import {TemporalConstraintType, WorkflowList, WorkflowListSimple} from "utils/models";
import MoveWorkflowListModal from "components/modals/move-workflowlist-modal";
import ButtonsMenu from "components/buttons-menu";
import {formatDate} from "utils/date-util";
import ModifyItemModal from "components/modals/modify-item-modal";

interface IItemProps {
    index: number
    workflowList: WorkflowList
    isInsideTemporalConstraintBoard: boolean
    boardChildLists: Array<WorkflowListSimple>
    boardChildItems: Array<WorkflowListSimple>
    modifyWorkflowList
    removeWorkflowList
    workflowListToMove
    selectWorkflowListToMove
    setTemporalConstraint
}

const ItemComponent = ({
                           index,
                           workflowList,
                           isInsideTemporalConstraintBoard,
                           boardChildLists,
                           boardChildItems,
                           modifyWorkflowList,
                           removeWorkflowList,
                           workflowListToMove,
                           selectWorkflowListToMove,
                           setTemporalConstraint
                       }: IItemProps): JSX.Element => {
    // STATE
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

    const getTemporalConstraintText = (): string => {
        if (!workflowList.temporalConstraint || workflowList.temporalConstraint.temporalConstraintType == TemporalConstraintType.noConstraint) {
            return "No constraint configured"
        } else {
            const temp = workflowList.temporalConstraint
            if (temp.temporalConstraintType == TemporalConstraintType.itemToBeInList) {
                const connectedList = boardChildLists.find(sl => sl.apiId == temp.connectedWorkflowListApiId)
                return "'" + connectedList.title + "' at " + formatDate(temp.dueDate);
            } else if (temp.temporalConstraintType == TemporalConstraintType.dependsOn) {
                const connectedItem = boardChildItems.find(sl => sl.apiId == temp.connectedWorkflowListApiId)
                return "Depends on '" + connectedItem.title + "'"
            }
        }
    }

    return (
        <Draggable key={workflowList.uuid}
                   draggableId={workflowList.uuid}
                   index={index}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef}
                     {...provided.draggableProps}
                     className="mb-2 mr-2">
                    <div className={"bg-white border border-gray-500 rounded shadow max-w-sm p-1" + moveClassName}>
                        <div className="flex place-content-between">
                            <div className="grid w-full m-1 hover:bg-gray-200"
                                 {...provided.dragHandleProps}
                            >
                                <span className="font-bold">{workflowList.title} </span>
                                {isInsideTemporalConstraintBoard &&
                                <div className="inline-flex items-center text-xs">
                                    <div className="w-3 h-3 mr-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    {getTemporalConstraintText()}
                                </div>
                                }
                            </div>
                            <ButtonsMenu workflowList={workflowList}
                                         removeWorkflowList={removeWorkflowList}
                                         selectWorkflowListToMove={selectWorkflowListToMove}
                                         openModifyModal={openModifyModal}
                                         openMoveModal={openMoveModal}/>
                        </div>
                        <div className="m-1 text-sm whitespace-pre bg-gray-50 rounded p-1">
                            {workflowList.description}
                        </div>
                    </div>
                    <ModifyItemModal show={showModifyModal}
                                     closeModal={closeModifyModal}
                                     workflowList={workflowList}
                                     isInsideTemporalConstraintBoard={isInsideTemporalConstraintBoard}
                                     boardChildLists={boardChildLists}
                                     boardChildItems={boardChildItems}
                                     modifyWorkflowList={modifyWorkflowList}
                                     setTemporalConstraint={setTemporalConstraint}
                    />
                    <MoveWorkflowListModal show={showMoveModal}
                                           closeModal={closeMoveModal}
                                           selectWorkflowListToMove={selectWorkflowListToMove}/>
                </div>
            )}
        </Draggable>
    )
}

export default ItemComponent

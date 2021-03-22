import {Draggable} from "react-beautiful-dnd";
import React, {useEffect, useState} from "react";
import {TemporalConstraintType, WorkflowList, WorkflowListType} from "utils/models";
import ModifyWorkflowListModal from "components/modals/modify-workflowlist-modal";
import MoveWorkflowListModal from "components/modals/move-workflowlist-modal";
import ButtonsMenu from "components/buttons-menu";
import {formatDate} from "utils/date-util";


interface IItemProps {
    index: number
    workflowList: WorkflowList
    isInsideTemporalConstraintBoard: boolean
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
                           modifyWorkflowList,
                           removeWorkflowList,
                           workflowListToMove,
                           selectWorkflowListToMove,
                           setTemporalConstraint
                       }: IItemProps): JSX.Element => {

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

    const getTemporalConstraintText = (): string => {
        if (!workflowList.temporalConstraint) {
            return "No temporal constraint configured"
        } else {
            const temp = workflowList.temporalConstraint
            if (temp.temporalConstraintType == TemporalConstraintType.itemToBeInList) {
                return "Should be in'" + temp.connectedWorkflowList.title + "' at " + formatDate(temp.dueDate);
            } else if (temp.temporalConstraintType == TemporalConstraintType.dependsOn) {
                return "Depends on '" + temp.connectedWorkflowList.title + "'"
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
                    <div
                        className={"bg-white hover:bg-gray-200 border border-gray-500 rounded shadow max-w-sm p-1" + moveClassName}
                        {...provided.dragHandleProps}>
                        <div className="grid grid-cols-2">
                            <div className="font-bold m-1">{workflowList.title}</div>
                            <ButtonsMenu workflowList={workflowList}
                                         removeWorkflowList={removeWorkflowList}
                                         selectWorkflowListToMove={selectWorkflowListToMove}
                                         openModifyModal={openModifyModal}
                                         openMoveModal={openMoveModal}/>
                        </div>
                        {isInsideTemporalConstraintBoard &&
                        <div className="m-1 text-sm">
                            {getTemporalConstraintText()}
                        </div>
                        }
                        <div className="m-1 text-sm">{workflowList.description}</div>
                    </div>
                    <ModifyWorkflowListModal show={showModifyModal}
                                             closeModal={closeModifyModal}
                                             modifyType={WorkflowListType.ITEM}
                                             workflowList={workflowList}
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

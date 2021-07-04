import {Draggable} from "react-beautiful-dnd";
import React, {useEffect, useState} from "react";
import {WorkflowList, WorkflowListSimple} from "utils/models";
import MoveWorkflowListModal from "components/modals/move-workflowlist-modal";
import ButtonsMenu from "components/buttons-menu";
import {formatDate, formatDuration} from "utils/date-util";
import ModifyItemModal from "components/modals/modify-item-modal";
import {isNoConstraint} from "utils/temp-constraint-util";

interface IItemProps {
    index: number
    workflowList: WorkflowList
    userApiId: string
    isInsideTemporalConstraintBoard: boolean
    boardChildLists: Array<WorkflowListSimple>
    modifyWorkflowList
    removeWorkflowList
    workflowListToMove
    selectWorkflowListToMove
    modifyTemporalResource
    modifyGenericResources
}


const ItemComponent = ({
                           index,
                           workflowList,
                           userApiId,
                           isInsideTemporalConstraintBoard,
                           boardChildLists,
                           modifyWorkflowList,
                           removeWorkflowList,
                           workflowListToMove,
                           selectWorkflowListToMove,
                           modifyTemporalResource,
                           modifyGenericResources
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

    const getTemporalResourceText = (): JSX.Element => {
        let elements: Array<JSX.Element> = []
        if (!isNoConstraint(workflowList.temporalResource)) {
            const temp = workflowList.temporalResource
            if (temp.startDate) {
                elements.push(
                    <div key={0} className="inline-flex items-center">
                        <div className="w-3 h-3 mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        {"Start date: " + formatDate(temp.startDate)}
                    </div>
                )
            }
            if (temp.endDate) {
                elements.push(
                    <div key={1} className="inline-flex items-center">
                        <div className="w-3 h-3 mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
                            </svg>
                        </div>
                        {"Due date: " + formatDate(temp.endDate)}
                    </div>
                )
            }
            if (temp.durationInMinutes) {
                elements.push(
                    <div key={2} className="inline-flex items-center">
                        <div className="w-3 h-3 mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        {"Takes " + formatDuration(temp.durationInMinutes)}
                    </div>
                )
                elements.push()
            }
            if (temp.connectedWorkflowListApiId) {
                const connectedList = boardChildLists.find(sl => sl.apiId == temp.connectedWorkflowListApiId)
                elements.push(
                    <div key={3} className="inline-flex items-center">
                        <div className="w-3 h-3 mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
                            </svg>
                        </div>
                        {"Connected List: '" + connectedList.title + "'"}
                    </div>
                )
            }
        }
        return (
            <div className="grid text-xs">
                {isNoConstraint(workflowList.temporalResource) &&
                "No constraint configured"
                }
                {!isNoConstraint(workflowList.temporalResource) &&
                elements.map(element => {
                    return (element)
                })
                }
            </div>
        )
    }

    return (
        <Draggable key={workflowList.apiId}
                   draggableId={workflowList.apiId}
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
                                getTemporalResourceText()
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
                                     modifyWorkflowList={modifyWorkflowList}
                                     modifyTemporalResource={modifyTemporalResource}
                                     modifyGenericResources={modifyGenericResources}
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

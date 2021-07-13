import {Draggable} from "react-beautiful-dnd";
import React, {useEffect, useState} from "react";
import {WorkflowList} from "utils/models";
import MoveWorkflowListModal from "components/modals/move-workflowlist-modal";
import ButtonsMenu from "components/buttons-menu";
import {formatDate, formatDuration} from "utils/date-util";
import ModifyItemModal from "components/modals/modify-item-modal";
import {hasNoTemporalResource} from "utils/resource-util";

interface IItemProps {
    index: number
    workflowList: WorkflowList
    userApiId: string
    isInsideTemporalConstraintBoard: boolean
    workflowListToMove: WorkflowList
    modifyWorkflowList
    removeWorkflowList
    selectWorkflowListToMove
    modifyResources
}


const ItemComponent = ({
                           index,
                           workflowList,
                           userApiId,
                           isInsideTemporalConstraintBoard,
                           workflowListToMove,
                           modifyWorkflowList,
                           removeWorkflowList,
                           selectWorkflowListToMove,
                           modifyResources
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
        if (!hasNoTemporalResource(workflowList.temporalResource)) {
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
        }
        return (
            <div className="grid text-xs">
                {!hasNoTemporalResource(workflowList.temporalResource) &&
                elements.map(element => {
                    return (element)
                })
                }
            </div>
        )
    }

    const getNumericResourcesText = (): JSX.Element => {
        return (
            <div className="grid text-xs">
                {
                    workflowList.numericResources.map((numericResource, index) => {
                        return (
                            <div key={index} className="inline-flex items-center">
                                <div className="w-3 h-3 mr-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                </div>
                                <span>{"" + numericResource.label}:&nbsp;</span>
                                <span>{numericResource.value}</span>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    const getTextualResourcesText = (): JSX.Element => {
        return (
            <div className="grid text-xs">
                {
                    workflowList.textualResources.map((textualResource, index) => {
                        return (
                            <div key={index} className="inline-flex items-center">
                                <div className="w-3 h-3 mr-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <span>{"" + textualResource.label}:&nbsp;</span>
                                <span>{textualResource.value}</span>
                            </div>
                        )
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
                    <div
                        className={"bg-white border border-gray-500 rounded shadow max-w-sm p-1" + moveClassName}>
                        <div className="flex place-content-between">
                            <div className="grid w-full m-1 hover:bg-gray-200"
                                 {...provided.dragHandleProps}
                            >
                                <span className="font-bold">{workflowList.title} </span>
                                {isInsideTemporalConstraintBoard &&
                                getTemporalResourceText()
                                }
                                {getNumericResourcesText()}
                                {getTextualResourcesText()}
                            </div>
                            <ButtonsMenu workflowList={workflowList}
                                         removeWorkflowList={removeWorkflowList}
                                         selectWorkflowListToMove={selectWorkflowListToMove}
                                         openModifyModal={openModifyModal}
                                         openMoveModal={openMoveModal}/>
                        </div>
                        <div className="m-1 text-sm whitespace-pre bg-gray-100 rounded p-1">
                            {workflowList.description}
                        </div>
                    </div>
                    <ModifyItemModal show={showModifyModal}
                                     closeModal={closeModifyModal}
                                     workflowList={workflowList}
                                     isInsideTemporalConstraintBoard={isInsideTemporalConstraintBoard}
                                     modifyWorkflowList={modifyWorkflowList}
                                     modifyResources={modifyResources}
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

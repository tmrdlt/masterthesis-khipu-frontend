import {Draggable} from "react-beautiful-dnd";
import React, {useEffect, useState} from "react";
import {WorkflowList} from "utils/models";
import MoveWorkflowListModal from "components/modals/move-workflowlist-modal";
import ButtonsMenu from "components/buttons-menu";
import {formatDate, formatDuration} from "utils/date-util";
import ModifyItemModal from "components/modals/modify-item-modal";
import {hasNoTemporalResource, hasNoUserResource} from "utils/resource-util";
import CalendarIcon, {ChartBarIcon, ClockIcon, DocumentTextIcon, FlagIcon, UserIcon} from "components/icons";

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
                            <CalendarIcon/>
                        </div>
                        {"Start date: " + formatDate(temp.startDate)}
                    </div>
                )
            }
            if (temp.endDate) {
                elements.push(
                    <div key={1} className="inline-flex items-center">
                        <div className="w-3 h-3 mr-1">
                            <FlagIcon/>
                        </div>
                        {"Due date: " + formatDate(temp.endDate)}
                    </div>
                )
            }
            if (temp.durationInMinutes) {
                elements.push(
                    <div key={2} className="inline-flex items-center">
                        <div className="w-3 h-3 mr-1">
                            <ClockIcon/>
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
                                    <ChartBarIcon/>
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
                                    <DocumentTextIcon/>
                                </div>
                                <span>{textualResource.label}</span>
                                <span>{textualResource.value ? ": " + textualResource.value : ""}</span>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    const getUserResourceText = (): JSX.Element => {
        console.log(workflowList.userResource)
        return (
            <div className="grid text-xs">
                {!hasNoUserResource(workflowList.userResource) &&
                <div key={index} className="inline-flex items-center">
                    <div className="w-3 h-3 mr-1">
                        <UserIcon/>
                    </div>
                    <span>{workflowList.userResource.username}</span>
                </div>
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
                                {getUserResourceText()}
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

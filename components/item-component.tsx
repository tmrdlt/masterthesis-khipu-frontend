import {Draggable} from "react-beautiful-dnd";
import React, {useState} from "react";
import {WorkflowList, WorkflowListType} from "utils/models";
import ModifyWorkflowListModal from "components/modify-workflowlist-modal";
import MoveWorkflowListModal from "components/move-workflowlist-modal";


interface IItemProps {
    index: number
    workflowList: WorkflowList
    modifyWorkflowList
    removeWorkflowList
    selectWorkflowListToMove
}

const ItemComponent = ({
                           index,
                           workflowList,
                           modifyWorkflowList,
                           removeWorkflowList,
                           selectWorkflowListToMove
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

    const moveClassName = showMoveModal ? " z-20 relative transition-all" : "";

    return (
        <Draggable key={workflowList.uuid}
                   draggableId={workflowList.uuid}
                   index={index}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef}
                     {...provided.draggableProps}
                     className="mb-2 mr-2">
                    <div className={"bg-white hover:bg-gray-200 border border-gray-500 rounded shadow w-60 p-1" + moveClassName}
                         {...provided.dragHandleProps}>
                        <div className="grid grid-cols-2">
                            <div className="font-bold m-1">{workflowList.title}</div>
                            <div className="flex justify-end m-1">
                                <div
                                    className="flex justify-center items-center w-30 h-8 border border-gray-600 bg-gray-200 rounded">
                                    <button type="button"
                                            onClick={() => {
                                                removeWorkflowList(workflowList.uuid)
                                            }}
                                            className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded m-1 p-1 w-6 h-6"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                    <button type="button"
                                            onClick={() => {
                                                openModifyModal();
                                            }}
                                            className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded m-1 p-1 w-6 h-6"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>
                                    <button type="button"
                                            onClick={() => {
                                                console.log("MOVE");
                                                selectWorkflowListToMove(workflowList);
                                                openMoveModal();
                                            }}
                                            className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded m-1 p-1 w-6 h-6"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="m-1">{workflowList.description}</div>
                    </div>
                    <ModifyWorkflowListModal show={showModifyModal}
                                             closeModal={closeModifyModal}
                                             modifyType={WorkflowListType.ITEM}
                                             workflowList={workflowList}
                                             modifyWorkflowList={modifyWorkflowList}/>
                    <MoveWorkflowListModal show={showMoveModal}
                                           closeModal={closeMoveModal}
                                           selectWorkflowListToMove={selectWorkflowListToMove}/>
                </div>
            )}
        </Draggable>
    )
}

export default ItemComponent

import {ConvertWorkflowListEntity, WorkflowList, WorkflowListType} from "utils/models";
import {Draggable, Droppable} from "react-beautiful-dnd";
import ListComponent from "components/list-component";
import React, {useState} from "react";
import CreateWorkflowListModal from "components/create-workflowlist-modal";
import ModifyWorkflowListModal from "components/modify-workflowlist-modal";
import ItemComponent from "components/item-component";
import {getDroppableStyle} from "utils/style-elements";
import MoveWorkflowListModal from "components/move-workflowlist-modal";
import DropButton from "components/drop-button";

interface IBoardProps {
    index: number
    workflowList: WorkflowList
    createWorkflowList
    modifyWorkflowList
    removeWorkflowList
    convertWorkflowList
    moveWorkflowList
    selectElementUuidToMove
    showHideDropButtonStyle
}

const BoardComponent = ({
                            index,
                            workflowList,
                            createWorkflowList,
                            modifyWorkflowList,
                            removeWorkflowList,
                            convertWorkflowList,
                            moveWorkflowList,
                            selectElementUuidToMove,
                            showHideDropButtonStyle
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

    return (
        <Draggable
            key={workflowList.uuid}
            draggableId={workflowList.uuid}
            index={index}
        >
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}
                     className="bg-blue-300 border border-gray-500 rounded shadow mb-2 mr-2 p-1">
                    <div className="grid grid-cols-2 hover:bg-blue-200"
                         {...provided.dragHandleProps}>
                        <div className="w-full font-bold m-1">{workflowList.title}</div>
                        <div className="flex justify-end m-1">
                            <div
                                className="flex justify-center items-center w-30 h-8 border border-gray-600 bg-blue-200 rounded">
                                <button
                                    type="button"
                                    onClick={() => {
                                        openCreateModal()
                                    }}
                                    className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded m-1 p-1 w-6 h-6"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                    </svg>
                                </button>
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
                                            openModifyModal()
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
                                            const cwle: ConvertWorkflowListEntity = {newUsageType: WorkflowListType.LIST}
                                            convertWorkflowList(workflowList.uuid, cwle)
                                        }}
                                        className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded m-1 p-1 w-6 h-6"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                </button>
                                <button type="button"
                                        onClick={() => {
                                            console.log("MOVE");
                                            selectElementUuidToMove(workflowList.uuid);
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
                                                                selectElementUuidToMove={selectElementUuidToMove}
                                                                showHideDropButtonStyle={showHideDropButtonStyle}
                                                />
                                            )
                                        } else if (wl.usageType == WorkflowListType.LIST) {
                                            return (
                                                <ListComponent key={index}
                                                               index={index}
                                                               workflowList={wl}
                                                               createWorkflowList={createWorkflowList}
                                                               modifyWorkflowList={modifyWorkflowList}
                                                               removeWorkflowList={removeWorkflowList}
                                                               convertWorkflowList={convertWorkflowList}
                                                               moveWorkflowList={moveWorkflowList}
                                                               selectElementUuidToMove={selectElementUuidToMove}
                                                               showHideDropButtonStyle={showHideDropButtonStyle}
                                                />
                                            )
                                        } else {
                                            return (
                                                <ItemComponent key={index}
                                                               index={index}
                                                               workflowList={wl}
                                                               modifyWorkflowList={modifyWorkflowList}
                                                               removeWorkflowList={removeWorkflowList}
                                                               selectElementUuidToMove={selectElementUuidToMove}/>
                                            )
                                        }
                                    })}
                                    <DropButton workflowListUuid={workflowList.uuid}
                                                moveWorkflowList={moveWorkflowList}
                                                showHideDropButtonStyle={showHideDropButtonStyle}/>
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>
                    <CreateWorkflowListModal show={showCreateModal}
                                             closeModal={closeCreateModal}
                                             createType={WorkflowListType.LIST}
                                             parentUuid={workflowList.uuid}
                                             createWorkflowList={createWorkflowList}/>
                    <ModifyWorkflowListModal show={showModifyModal}
                                             closeModal={closeModifyModal}
                                             modifyType={WorkflowListType.BOARD}
                                             workflowList={workflowList}
                                             modifyWorkflowList={modifyWorkflowList}/>
                    <MoveWorkflowListModal show={showMoveModal}
                                           closeModal={closeMoveModal}
                                           selectElementUuidToMove={selectElementUuidToMove}/>
                </div>
            )}
        </Draggable>
    )
}

export default BoardComponent

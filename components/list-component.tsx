import {Draggable, Droppable} from "react-beautiful-dnd";
import React, {useState} from "react";
import {ConvertWorkflowListEntity, WorkflowList, WorkflowListType} from "utils/models";
import ItemComponent from "components/item-component";
import CreateWorkflowListModal from "components/create-workflowlist-modal";
import ModifyWorkflowListModal from "components/modify-workflowlist-modal";
import BoardComponent from "components/board-component";
import {getDroppableStyle} from "utils/style-elements";
import MoveWorkflowListModal from "components/move-workflowlist-modal";
import DropButton from "components/drop-button";

interface IListProps {
    index: number
    workflowList: WorkflowList
    createWorkflowList
    modifyWorkflowList
    removeWorkflowList
    convertWorkflowList
    moveWorkflowList
    selectWorkflowListToMove
    showDropButton
}

const ListComponent = ({
                           index,
                           workflowList,
                           createWorkflowList,
                           modifyWorkflowList,
                           removeWorkflowList,
                           convertWorkflowList,
                           moveWorkflowList,
                           selectWorkflowListToMove,
                           showDropButton
                       }: IListProps): JSX.Element => {

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

    const moveClassName = showMoveModal ? " z-20 relative transition-all" : "";

    return (
        <Draggable
            key={workflowList.uuid}
            draggableId={workflowList.uuid}
            index={index}
        >
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <div
                        className={"bg-red-300 border border-gray-500 rounded shadow min-w-min max-w-max mb-2 mr-2 p-1" + moveClassName}>
                        <div className="grid grid-cols-2 hover:bg-red-200"
                             {...provided.dragHandleProps}>
                            <div className="w-full font-bold m-1">{workflowList.title}</div>
                            <div className="flex justify-end m-1">
                                <div
                                    className="flex justify-center items-center w-30 h-8 border border-gray-600 bg-red-200 rounded">
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
                                                const cwle: ConvertWorkflowListEntity = {newUsageType: WorkflowListType.BOARD}
                                                convertWorkflowList(workflowList.uuid, cwle)
                                            }}
                                            className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded m-1 p-1 w-6 h-6"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                        </svg>
                                    </button>
                                    <button type="button"
                                            onClick={() => {
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
                                                                selectWorkflowListToMove={selectWorkflowListToMove}
                                                                showDropButton={showDropButton}
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
                                                               selectWorkflowListToMove={selectWorkflowListToMove}
                                                               showDropButton={showDropButton}
                                                />
                                            )
                                        } else {
                                            return (
                                                <ItemComponent key={index}
                                                               index={index}
                                                               workflowList={wl}
                                                               modifyWorkflowList={modifyWorkflowList}
                                                               removeWorkflowList={removeWorkflowList}
                                                               selectWorkflowListToMove={selectWorkflowListToMove}/>
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
                    <ModifyWorkflowListModal show={showModifyModal}
                                             closeModal={closeModifyModal}
                                             modifyType={WorkflowListType.LIST}
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

export default ListComponent

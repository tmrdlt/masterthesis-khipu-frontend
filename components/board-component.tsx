import {WorkflowList, WorkflowListType} from "utils/models";
import {Draggable, Droppable} from "react-beautiful-dnd";
import ListComponent from "components/list-component";
import React, {useState} from "react";
import CreateWorkflowListModal from "components/create-workflowlist-modal";
import ModifyWorkflowListModal from "components/modify-workflowlist-modal";
import ItemComponent from "components/item-component";

interface IBoardProps {
    index: number
    workflowList: WorkflowList
    createWorkflowList
    modifyWorkflowList
    removeWorkflowList
}

const BoardComponent = ({
                            index,
                            workflowList,
                            createWorkflowList,
                            modifyWorkflowList,
                            removeWorkflowList
                        }: IBoardProps): JSX.Element => {

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showModifyModal, setShowModifyModal] = useState(false)

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

    return (
        <Draggable
            key={workflowList.uuid}
            draggableId={workflowList.uuid}
            index={index}
        >
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <div className="bg-blue-400 grid rounded shadow border p-2 m-2">
                        <div {...provided.dragHandleProps} className="font-bold m-1">{workflowList.title}</div>
                        <div className="m-1">{workflowList.description}</div>
                        <div className="grid, grid-cols-3">
                            <button
                                type="button"
                                onClick={() => {
                                    openCreateModal()
                                }}
                                className="bg-transparent hover:bg-black text-black font-semibold hover:text-white py-0.5 px-0.5 text-xs border border-black hover:border-transparent rounded m-1"
                            >Add List
                            </button>
                            <CreateWorkflowListModal show={showCreateModal}
                                                     closeModal={closeCreateModal}
                                                     createType={WorkflowListType.LIST}
                                                     parentUuid={workflowList.uuid}
                                                     createWorkflowList={createWorkflowList}/>
                            <button type="button"
                                    onClick={() => {
                                        removeWorkflowList(workflowList.uuid)
                                    }}
                                    className="bg-transparent hover:bg-black text-black font-semibold hover:text-white py-0.5 px-0.5 text-xs border border-black hover:border-transparent rounded m-1"
                            >Delete
                            </button>
                            <button type="button"
                                    onClick={() => {
                                        openModifyModal()
                                    }}
                                    className="bg-transparent hover:bg-black text-black font-semibold hover:text-white py-0.5 px-0.5 text-xs border border-black hover:border-transparent rounded m-1"
                            >Modify
                            </button>
                            <button type="button"
                                    onClick={() => {
                                        console.log("Toggle View")
                                    }}
                                    className="bg-transparent hover:bg-black text-black font-semibold hover:text-white py-0.5 px-0.5 text-xs border border-black hover:border-transparent rounded m-1"
                            >Convert
                            </button>
                            <ModifyWorkflowListModal show={showModifyModal}
                                                     closeModal={closeModifyModal}
                                                     modifyType={WorkflowListType.BOARD}
                                                     workflowList={workflowList}
                                                     modifyWorkflowList={modifyWorkflowList}/>
                        </div>
                        <Droppable droppableId={workflowList.uuid} direction="horizontal" type="LIST">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}
                                     {...provided.droppableProps}>
                                    <div className="w-full p-8 flex justify-start font-sans">
                                        {workflowList.children.map((wl, index) => {
                                            if (wl.usageType == WorkflowListType.BOARD) {
                                                return (
                                                    <BoardComponent key={index}
                                                                    index={index}
                                                                    workflowList={wl}
                                                                    createWorkflowList={createWorkflowList}
                                                                    modifyWorkflowList={modifyWorkflowList}
                                                                    removeWorkflowList={removeWorkflowList}
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
                                                    />
                                                )
                                            } else {
                                                return(
                                                    <ItemComponent key={index}
                                                                   index={index}
                                                                   workflowList={wl}
                                                                   modifyWorkflowList={modifyWorkflowList}
                                                                   removeWorkflowList={removeWorkflowList}/>
                                                )
                                            }
                                        })}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default BoardComponent

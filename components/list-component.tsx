import {Draggable, Droppable} from "react-beautiful-dnd";
import React, {useState} from "react";
import {ConvertWorkflowListEntity, WorkflowList, WorkflowListType} from "utils/models";
import ItemComponent from "components/item-component";
import CreateWorkflowListModal from "components/create-workflowlist-modal";
import ModifyWorkflowListModal from "components/modify-workflowlist-modal";
import BoardComponent from "components/board-component";

interface IListProps {
    index: number
    workflowList: WorkflowList
    createWorkflowList
    modifyWorkflowList
    removeWorkflowList
    convertWorkflowList
}

const ListComponent = ({
                           index,
                           workflowList,
                           createWorkflowList,
                           modifyWorkflowList,
                           removeWorkflowList,
                           convertWorkflowList
                       }: IListProps): JSX.Element => {

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
                    <div className="grid bg-red-300 border border-gray-500 rounded shadow w-70 p-2 m-2">
                        <div {...provided.dragHandleProps} className="font-bold m-1">{workflowList.title}</div>
                        <div className="m-1">{workflowList.description}</div>
                        <div className="grid grid-cols-4">
                            <button
                                type="button"
                                onClick={() => {
                                    openCreateModal()
                                }}
                                className="bg-transparent hover:bg-gray-600 text-gray-600 font-semibold hover:text-white py-0.5 px-0.5 text-xs border border-gray-600 hover:border-transparent rounded m-1"
                            >Add item
                            </button>
                            <CreateWorkflowListModal show={showCreateModal}
                                                     closeModal={closeCreateModal}
                                                     createType={WorkflowListType.ITEM}
                                                     parentUuid={workflowList.uuid}
                                                     createWorkflowList={createWorkflowList}/>
                            <button type="button"
                                    onClick={() => {
                                        removeWorkflowList(workflowList.uuid)
                                    }}
                                    className="bg-transparent hover:bg-gray-600 text-gray-600 font-semibold hover:text-white py-0.5 px-0.5 text-xs border border-gray-600 hover:border-transparent rounded m-1"
                            >Delete
                            </button>
                            <button type="button"
                                    onClick={() => {
                                        openModifyModal()
                                    }}
                                    className="bg-transparent hover:bg-gray-600 text-gray-600 font-semibold hover:text-white py-0.5 px-0.5 text-xs border border-gray-600 hover:border-transparent rounded m-1"
                            >Modify
                            </button>
                            <button type="button"
                                    onClick={() => {
                                        const cwle: ConvertWorkflowListEntity = {newUsageType: WorkflowListType.BOARD}
                                        convertWorkflowList(workflowList.uuid, cwle)
                                    }}
                                    className="bg-transparent hover:bg-gray-600 text-gray-600 font-semibold hover:text-white py-0.5 px-0.5 text-xs border border-gray-600 hover:border-transparent rounded m-1"
                            >To Board
                            </button>
                            <ModifyWorkflowListModal show={showModifyModal}
                                                     closeModal={closeModifyModal}
                                                     modifyType={WorkflowListType.LIST}
                                                     workflowList={workflowList}
                                                     modifyWorkflowList={modifyWorkflowList}/>
                        </div>
                        <Droppable droppableId={workflowList.uuid} type="LIST">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}
                                     {...provided.droppableProps}
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
                                                />
                                            )
                                        } else {
                                            return (
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
                            )}
                        </Droppable>
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default ListComponent

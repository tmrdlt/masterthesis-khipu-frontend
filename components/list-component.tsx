import {Draggable, Droppable} from "react-beautiful-dnd";
import React, {useState} from "react";
import {WorkflowList, WorkflowListType} from "utils/models";
import ItemComponent from "components/item-component";
import CreateWorkflowListModal from "components/create-workflowlist-modal";
import ModifyWorkflowListModal from "components/modify-workflowlist-modal";

interface IListProps {
    index: number
    list: WorkflowList
    createWorkflowList
    modifyWorkflowList
    removeWorkflowList
}

const ListComponent = ({
                           index,
                           list,
                           createWorkflowList,
                           modifyWorkflowList,
                           removeWorkflowList
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
            key={list.uuid}
            draggableId={list.uuid}
            index={index}
        >
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <div className="bg-gray-200 grid rounded shadow border w-64 p-2 m-1">
                        <div {...provided.dragHandleProps} className="font-bold m-1">{list.title}</div>
                        <div className="m-1">{list.description}</div>
                        <div className="grid, grid-cols-3">
                            <button
                                type="button"
                                onClick={() => {
                                    openCreateModal()
                                }}
                                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-0.5 px-1 border border-blue-500 hover:border-transparent rounded m-1"
                            >Add item
                            </button>
                            <CreateWorkflowListModal show={showCreateModal}
                                                     closeModal={closeCreateModal}
                                                     createType={WorkflowListType.Item}
                                                     parentUuid={list.uuid}
                                                     createWorkflowList={createWorkflowList}/>
                            <button type="button"
                                    onClick={() => {
                                        removeWorkflowList(list.uuid)
                                    }}
                                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-0.5 px-1 border border-blue-500 hover:border-transparent rounded m-1"
                            >Delete
                            </button>
                            <button type="button"
                                    onClick={() => {
                                        openModifyModal()
                                    }}
                                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-0.5 px-1 border border-blue-500 hover:border-transparent rounded m-1"
                            >Modify
                            </button>
                            <ModifyWorkflowListModal show={showModifyModal}
                                                     closeModal={closeModifyModal}
                                                     modifyType={WorkflowListType.List}
                                                     workflowList={list}
                                                     modifyWorkflowList={modifyWorkflowList}/>
                        </div>
                        <Droppable droppableId={list.uuid} type="LIST">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}
                                     {...provided.droppableProps}
                                >
                                    {list.children.map((item, index) => (
                                        <ItemComponent key={item.uuid} item={item} index={index}
                                                       modifyWorkflowList={modifyWorkflowList}
                                                       removeWorkflowList={removeWorkflowList}/>
                                    ))}
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

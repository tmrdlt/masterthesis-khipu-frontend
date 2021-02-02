import {Draggable} from "react-beautiful-dnd";
import React, {useState} from "react";
import {WorkflowList, WorkflowListType} from "utils/models";
import ModifyWorkflowListModal from "components/modify-workflowlist-modal";


interface IItemProps {
    index: number
    workflowList: WorkflowList
    modifyWorkflowList
    removeWorkflowList
}

const ItemComponent = ({index, workflowList, modifyWorkflowList, removeWorkflowList}: IItemProps): JSX.Element => {

    const [showModifyModal, setShowModifyModal] = useState(false)

    const openModifyModal = () => {
        setShowModifyModal(true);
    }
    const closeModifyModal = () => {
        setShowModifyModal(false);
    }

    return (
        <Draggable key={workflowList.uuid} draggableId={workflowList.uuid} index={index}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
                >
                    <div
                        className="grid bg-white border border-gray-500 rounded shadow p-2 m-2">
                        <div className="font-bold m-1">{workflowList.title}</div>
                        <div className="m-1">{workflowList.description}</div>
                        <div className="grid grid-cols-2">
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
                            <ModifyWorkflowListModal show={showModifyModal}
                                                     closeModal={closeModifyModal}
                                                     modifyType={WorkflowListType.ITEM}
                                                     workflowList={workflowList}
                                                     modifyWorkflowList={modifyWorkflowList}/>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default ItemComponent

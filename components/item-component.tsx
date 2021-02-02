import {Draggable} from "react-beautiful-dnd";
import React, {useState} from "react";
import {WorkflowList, WorkflowListType} from "utils/models";
import ModifyWorkflowListModal from "components/modify-workflowlist-modal";


interface IItemProps {
    item: WorkflowList
    index: number
    modifyWorkflowList
    removeWorkflowList
}

const ItemComponent = ({item, index, modifyWorkflowList, removeWorkflowList}: IItemProps): JSX.Element => {

    const [showModifyModal, setShowModifyModal] = useState(false)

    const openModifyModal = () => {
        setShowModifyModal(true);
    }
    const closeModifyModal = () => {
        setShowModifyModal(false);
    }

    return (
        <Draggable key={item.uuid} draggableId={item.uuid} index={index}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
                >
                    <div
                        className="bg-white grid p-2 rounded shadow border m-1">
                        <div className="font-bold m-1">{item.title}</div>
                        <div className="m-1">{item.description}</div>
                        <div className="grid grid-cols-2">
                            <button type="button"
                                    onClick={() => {
                                        removeWorkflowList(item.uuid)
                                    }}
                                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-0.5 px-0.5 text-xs border border-blue-500 hover:border-transparent rounded m-1"
                            >Delete
                            </button>
                            <button type="button"
                                    onClick={() => {
                                        openModifyModal()
                                    }}
                                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-0.5 px-0.5 text-xs border border-blue-500 hover:border-transparent rounded m-1"
                            >Modify
                            </button>
                            <ModifyWorkflowListModal show={showModifyModal}
                                                     closeModal={closeModifyModal}
                                                     modifyType={WorkflowListType.Item}
                                                     workflowList={item}
                                                     modifyWorkflowList={modifyWorkflowList}/>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default ItemComponent

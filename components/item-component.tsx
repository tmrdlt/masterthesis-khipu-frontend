import {Draggable} from "react-beautiful-dnd";
import React, {useState} from "react";
import {WorkflowList, WorkflowListType} from "utils/models";
import ModifyWorkflowListModal from "components/modify-workflowlist-modal";
import MoveWorkflowListModal from "components/move-workflowlist-modal";
import ButtonsMenu from "components/buttons-menu";


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
                            <ButtonsMenu workflowList={workflowList}
                                         removeWorkflowList={removeWorkflowList}
                                         selectWorkflowListToMove={selectWorkflowListToMove}
                                         openModifyModal={openModifyModal}
                                         openMoveModal={openMoveModal}/>
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

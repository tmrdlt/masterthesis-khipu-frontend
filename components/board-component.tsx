import {WorkflowList, WorkflowListType} from "utils/models";
import {Draggable, Droppable} from "react-beautiful-dnd";
import ListComponent from "components/list-component";
import React, {useState} from "react";
import CreateWorkflowListModal from "components/create-workflow-list-modal";

interface IBoardProps {
    index: number
    board: WorkflowList
    createWorkflowList
    removeWorkflowList
}

const BoardComponent = ({index, board, createWorkflowList, removeWorkflowList}: IBoardProps): JSX.Element => {

    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
        setShowModal(true);
    }
    const closeModal = () => {
        setShowModal(false);
    }
    return (
        <Draggable
            key={board.uuid}
            draggableId={board.uuid}
            index={index}
        >
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <div className="bg-blue-400 grid rounded shadow border p-2 m-2">
                        <div {...provided.dragHandleProps} className="font-bold m-1">{board.title}</div>
                        <div className="m-1">{board.description}</div>
                        <div className="grid, grid-cols-3">
                            <button
                                type="button"
                                onClick={() => {
                                    openModal()
                                }}
                                className="bg-transparent hover:bg-black text-black font-semibold hover:text-white py-0.5 px-1 border border-black hover:border-transparent rounded m-1"
                            >Add List
                            </button>
                            <CreateWorkflowListModal show={showModal}
                                                     closeModal={closeModal}
                                                     createType={WorkflowListType.List}
                                                     parentUuid={board.uuid}
                                                     createWorkflowList={createWorkflowList}/>
                            <button type="button"
                                    onClick={() => {
                                        removeWorkflowList(board.uuid)
                                    }}
                                    className="bg-transparent hover:bg-black text-black font-semibold hover:text-white py-0.5 px-1 border border-black hover:border-transparent rounded m-1"
                            >Delete
                            </button>
                            <button type="button"
                                    onClick={() => {
                                        console.log("modify")
                                    }}
                                    className="bg-transparent hover:bg-black text-black font-semibold hover:text-white py-0.5 px-1 border border-black hover:border-transparent rounded m-1"
                            >Modify
                            </button>
                        </div>
                        <Droppable droppableId={board.uuid} direction="horizontal" type="BOARD">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}
                                     {...provided.droppableProps}>
                                    <div className="w-full p-8 flex justify-start font-sans">
                                        {board.children.map((list, index) => (
                                            <ListComponent key={index}
                                                           index={index}
                                                           list={list}
                                                           createWorkflowList={createWorkflowList}
                                                           removeWorkflowList={removeWorkflowList}/>
                                        ))}
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

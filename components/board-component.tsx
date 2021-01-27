import {WorkflowList} from "utils/models";
import {Draggable, Droppable} from "react-beautiful-dnd";
import ListComponent from "components/list-component";
import React from "react";

interface IBoardProps {
    board: WorkflowList
    index: number
    createWorkflowList
    removeWorkflowList
}

const BoardComponent = ({board, index, createWorkflowList, removeWorkflowList}: IBoardProps): JSX.Element => {
    return (
        <Draggable
            key={board.uuid}
            draggableId={board.uuid}
            index={index}
        >
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <div className="bg-blue-400 m-1">
                        <div {...provided.dragHandleProps}>{board.title}</div>
                        <button
                            type="button"
                            onClick={() => {
                                createWorkflowList({
                                    title: "list",
                                    description: "list",
                                    parentUuid: board.uuid
                                })
                            }}
                        >Add List
                        </button>
                        <button type="button" onClick={() => {
                            removeWorkflowList(board.uuid)
                        }}>Delete
                        </button>
                        <Droppable droppableId={board.uuid} direction="horizontal" type="BOARD">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}
                                     {...provided.droppableProps}>
                                    <div className="w-full p-8 flex justify-start font-sans">
                                        {board.children.map((list, index) => (
                                            <ListComponent key={index} list={list} index={index}
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

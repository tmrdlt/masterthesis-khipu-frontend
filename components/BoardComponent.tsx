import {WorkflowList} from "utils/models";
import {Draggable, Droppable} from "react-beautiful-dnd";
import {getListStyle} from "utils/styleElements";
import ListComponent from "components/ListComponent";
import React from "react";

interface IBoardProps {
    board: WorkflowList
    index: number
}

const BoardComponent = ({board, index}: IBoardProps): JSX.Element => {
    return (
        <Droppable droppableId={board.uuid} direction="horizontal">
            {(provided, snapshot) => (
                <div ref={provided.innerRef}
                     {...provided.droppableProps}
                     className="bg-blue-400 w-full p-8 flex justify-center font-sans"
                >
                    {board.children.map((list, index) => (
                        <ListComponent key={index} list={list} index={index}/>
                    ))}
                    {provided.placeholder}
                </div>

            )}
        </Droppable>
    )
}

export default BoardComponent

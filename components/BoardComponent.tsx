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
        <Droppable droppableId={board.uuid} type="BOARD">
            {(provided, snapshot) => (
                <div ref={provided.innerRef}
                     {...provided.droppableProps}
                     style={getListStyle(snapshot.isDraggingOver)}
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

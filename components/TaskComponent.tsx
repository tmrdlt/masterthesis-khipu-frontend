import {Task} from "utils/initial-data"
import {Draggable} from "react-beautiful-dnd";
import React from "react";


interface ITaskProps {
    key: string
    task: Task
    index: number
}

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

const TaskComponent = ({key, task, index}: ITaskProps): JSX.Element => {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
                     style={getItemStyle(
                         snapshot.isDragging,
                         provided.draggableProps.style
                     )}
                     className="container mx-auto"
                >
                    {task.content}
                </div>
            )}
        </Draggable>
    )
}

export default TaskComponent

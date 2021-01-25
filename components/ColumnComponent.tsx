import {Column, Task} from 'utils/initial-data'
import TaskComponent from "components/TaskComponent"
import {Droppable} from "react-beautiful-dnd";
import React from "react";


interface IColumnProps {
    column: Column
    tasks: Array<Task>
}

const grid = 8; // TODO move elsewhere

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250
});

const ColumnComponent = ({column, tasks}: IColumnProps): JSX.Element => {
    return (
        <div className="container mx-auto">
            <div>{column.title}</div>
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef}
                         {...provided.droppableProps}
                         style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {tasks.map((task, index) => (
                            <TaskComponent key={task.id} task={task} index={index}/>
                            ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}

export default ColumnComponent

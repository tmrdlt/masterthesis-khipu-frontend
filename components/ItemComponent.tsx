import {Draggable} from "react-beautiful-dnd";
import React from "react";
import {WorkflowList} from "utils/models";
import {getItemStyle} from "utils/styleElements";


interface IItemProps {
    item: WorkflowList
    index: number
}

const ItemComponent = ({item, index}: IItemProps): JSX.Element => {
    return (
        <Draggable key={item.uuid} draggableId={item.uuid} index={index}>
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
                    {item.description}
                </div>
            )}
        </Draggable>
    )
}

export default ItemComponent

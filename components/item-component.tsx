import {Draggable} from "react-beautiful-dnd";
import React from "react";
import {WorkflowList} from "utils/models";


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
                     className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter"
                >
                    {item.description}
                </div>
            )}
        </Draggable>
    )
}

export default ItemComponent

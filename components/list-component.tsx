import {Draggable, Droppable} from "react-beautiful-dnd";
import React from "react";
import {WorkflowList} from "utils/models";
import ItemComponent from "components/item-component";

interface IListProps {
    list: WorkflowList
    index: number
}

const ListComponent = ({list, index}: IListProps): JSX.Element => {
    return (
        <Draggable
            key={list.uuid}
            draggableId={list.uuid}
            index={index}
        >
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <div className="rounded bg-gray-200 w-64 p-2 m-1">
                        <div {...provided.dragHandleProps}>{list.title}</div>
                        <Droppable droppableId={list.uuid} type="LIST">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}
                                     {...provided.droppableProps}
                                >
                                    {list.children.map((item, index) => (
                                        <ItemComponent key={item.uuid} item={item} index={index}/>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default ListComponent

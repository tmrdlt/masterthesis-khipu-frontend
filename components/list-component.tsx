import {Draggable, Droppable} from "react-beautiful-dnd";
import React from "react";
import {WorkflowList} from "utils/models";
import ItemComponent from "components/item-component";

interface IListProps {
    list: WorkflowList
    index: number
    createWorkflowList
    removeWorkflowList
}

const ListComponent = ({list, index, createWorkflowList, removeWorkflowList}: IListProps): JSX.Element => {
    return (
        <Draggable
            key={list.uuid}
            draggableId={list.uuid}
            index={index}
        >
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <div className="bg-gray-200 grid rounded shadow border w-64 p-2 m-1">
                        <div {...provided.dragHandleProps} className="font-bold m-1">{list.title}</div>
                        <div className="m-1">{list.description}</div>
                        <div className="grid, grid-cols-3">
                            <button
                                type="button"
                                onClick={() => {
                                    createWorkflowList({
                                        title: "Item Title",
                                        description: "Item Description",
                                        parentUuid: list.uuid
                                    })
                                }}
                                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-0.5 px-1 border border-blue-500 hover:border-transparent rounded m-1"
                            >Add item
                            </button>
                            <button type="button"
                                    onClick={() => {
                                        removeWorkflowList(list.uuid)
                                    }}
                                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-0.5 px-1 border border-blue-500 hover:border-transparent rounded m-1"
                            >Delete
                            </button>
                            <button type="button"
                                    onClick={() => {
                                        console.log("modify")
                                    }}
                                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-0.5 px-1 border border-blue-500 hover:border-transparent rounded m-1"
                            >Modify
                            </button>
                        </div>
                        <Droppable droppableId={list.uuid} type="LIST">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}
                                     {...provided.droppableProps}
                                >
                                    {list.children.map((item, index) => (
                                        <ItemComponent key={item.uuid} item={item} index={index}
                                                       removeWorkflowList={removeWorkflowList}/>
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

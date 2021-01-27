import {Draggable} from "react-beautiful-dnd";
import React from "react";
import {WorkflowList} from "utils/models";


interface IItemProps {
    item: WorkflowList
    index: number
    removeWorkflowList
}

const ItemComponent = ({item, index, removeWorkflowList}: IItemProps): JSX.Element => {
    return (
        <Draggable key={item.uuid} draggableId={item.uuid} index={index}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
                >
                    <div
                        className="bg-white grid p-2 rounded shadow border m-1">
                        <div className="font-bold m-1">{item.title}</div>
                        <div className="m-1">{item.description}</div>
                        <div className="grid grid-cols-2">
                            <button type="button"
                                    onClick={() => {
                                        removeWorkflowList(item.uuid)
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


                    </div>

                </div>
            )}
        </Draggable>
    )
}

export default ItemComponent

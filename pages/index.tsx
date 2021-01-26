import React, {FunctionComponent, useEffect, useState} from "react";
import {DragDropContext, Draggable, Droppable, DropResult, DraggableLocation} from "react-beautiful-dnd";
import {initialData} from "utils/initial-data";
import axios from "axios";
import {WorkflowList} from "utils/models";

const grid = 8;

/**
 * Reorder items inside a list.
 */
const reorder = (items: Array<WorkflowList>, startIndex: number, endIndex: number) => {
    const [removed] = items.splice(startIndex, 1);
    items.splice(endIndex, 0, removed);
    return items;
};

/**
 * Move an item from one list to another list.
 */
const move = (sourceItems: Array<WorkflowList>,
              destinationItems: Array<WorkflowList>,
              droppableSource: DraggableLocation,
              droppableDestination: DraggableLocation): [Array<WorkflowList>, Array<WorkflowList>] => {
    const sourceClone = Array.from(sourceItems);
    const destinationClone = Array.from(destinationItems);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destinationClone.splice(droppableDestination.index, 0, removed);

    return [sourceClone, destinationClone];
};

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
const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250
});

const Home: FunctionComponent = (): JSX.Element => {

    const [state, setState] = useState(initialData);

    useEffect(() => {
        getWorkflowLists();
    }, []);

    const getWorkflowLists = async () => {
        axios.get('http://localhost:5001/workflowList', {
            method: 'GET'
        }).then(function (response) {
            const workflowLists: Array<WorkflowList> = response.data;
            console.log(workflowLists)
            setState(workflowLists);
        }).catch(function (error) {
            console.log(error)
        });
    }

    function onDragEnd(result: DropResult) {
        const {destination, source} = result;

        if (!destination) {
            return;
        }

        const sourceDroppableId: string = source.droppableId;
        const destinationDroppableId: string = destination.droppableId;

        if (sourceDroppableId === destinationDroppableId) {
            const list = state.find(list => list.uuid == sourceDroppableId);
            const listIndex = state.indexOf(list);
            const reorderedItems = reorder(list.children, source.index, destination.index);
            // Make shallow copy
            const newState = [...state];
            newState[listIndex].children = reorderedItems;
            setState(newState);
        } else {
            const sourceList = state.find(list => list.uuid == sourceDroppableId);
            const destinationList = state.find(list => list.uuid == destinationDroppableId);
            const sourceListIndex = state.indexOf(sourceList);
            const destinationListIndex = state.indexOf(destinationList);

            const result = move(sourceList.children, destinationList.children, source, destination);
            // Make shallow copy
            const newState = [...state];
            newState[sourceListIndex].children = result[0];
            newState[destinationListIndex].children = result[1];

            setState(newState);
        }
    }

    return (
        // TODO move into components
        <div style={{display: "flex"}}>
            <DragDropContext onDragEnd={onDragEnd}>
                {state.map((list, index) => (
                    <Droppable key={index} droppableId={list.uuid}>
                        {(provided, snapshot) => (
                            <div className="container mx-auto">
                                <div>{list.title}</div>
                                <div ref={provided.innerRef}
                                     {...provided.droppableProps}
                                     style={getListStyle(snapshot.isDraggingOver)}
                                >
                                    {list.children.map((item, index) => (
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
                                        </Draggable>))}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>

                ))}
            </DragDropContext>
        </div>
    );
};

export default Home

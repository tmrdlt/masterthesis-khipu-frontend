const grid = 8;

export const getDraggableStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    width: isDragging ? 400 : 200,
    ...draggableStyle
});

export const getDroppableStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightgreen" : "transparent",
});

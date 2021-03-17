import React, {useState} from "react";
import {CreateWorkflowListEntity, WorkflowListType} from "utils/models";


interface CreateWorkflowListModalProps {
    show
    closeModal
    createType: WorkflowListType
    parentUuid: string
    createWorkflowList
}

const CreateWorkflowListModal = ({
                                     show,
                                     closeModal,
                                     createType,
                                     parentUuid,
                                     createWorkflowList
                                 }: CreateWorkflowListModalProps): JSX.Element => {

    const initCreateWorkflowListEntity: CreateWorkflowListEntity = {
        title: "",
        listType: createType,
        parentApiId: parentUuid,
        description: ""
    }
    const showHideStyle = show ? {display: "block"} : {display: "none"};

    const [state, setState] = useState(initCreateWorkflowListEntity)

    const handleFormChange = (event) => {
        console.log(event)
        const newState = {...state, [event.target.id]: event.target.value}
        setState(newState)
    }
    return (
        <div style={showHideStyle}
             className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 text-sm">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"/>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                    Create a...
                                </h3>
                                <div className="mt-2">
                                    <form action="/" method="post">
                                        <div className="flex items-center mb-4">
                                            <label className="inline-flex items-center mr-3">
                                                <input type="radio"
                                                       value={WorkflowListType.BOARD}
                                                       id="listType"
                                                       checked={state.listType === WorkflowListType.BOARD}
                                                       onChange={handleFormChange}
                                                className="h-4 w-4"/>
                                                <span className="ml-1">Board</span>
                                            </label>
                                            <label className="inline-flex items-center mr-3">
                                                <input type="radio"
                                                       value={WorkflowListType.LIST}
                                                       id="listType"
                                                       checked={state.listType === WorkflowListType.LIST}
                                                       onChange={handleFormChange}
                                                       className="h-4 w-4"/>
                                                <span className="ml-1">List</span>
                                            </label>
                                            <label className="inline-flex items-center mr-3">
                                                <input type="radio"
                                                       value={WorkflowListType.ITEM}
                                                       id="listType"
                                                       checked={state.listType === WorkflowListType.ITEM}
                                                       onChange={handleFormChange}
                                                       className="h-4 w-4"/>
                                                <span className="ml-1">Item</span>
                                            </label>
                                        </div>
                                        <div className="flex flex-col mb-4">
                                            <label>Title</label>
                                            <input className="border" type="text" value={state.title}
                                                   onChange={handleFormChange} id="title"/>
                                        </div>
                                        <div className="flex flex-col mb-4">
                                            <label>Description</label>
                                            <input className="border" type="text" value={state.description}
                                                   onChange={handleFormChange} id="description"/>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button"
                                disabled={state.title === ""}
                                onClick={() => {
                                    createWorkflowList(state).then(res => {
                                        closeModal()
                                        setState(initCreateWorkflowListEntity)
                                    })
                                }}
                                className="disabled:opacity-50 disabled:cursor-not-allowed w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                closeModal()
                                setState(initCreateWorkflowListEntity)
                            }}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >Cancel
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CreateWorkflowListModal

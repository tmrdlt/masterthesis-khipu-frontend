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
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"/>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    role="dialog" aria-modal="true" aria-labelledby="modal-headline">

                    { /* This div is taken from https://tailwindcss-forms.vercel.app/ simple --> */}
                    <div className="m-5">
                        <h3 className="font-bold">Create a...</h3>
                        <div className="mt-4 w-full text-sm">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center">
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
                                <label className="block">
                                    <span className="text-gray-700">Title</span>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                        value={state.title}
                                        onChange={handleFormChange}
                                        id="title"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">Description</span>
                                    <textarea
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                        rows={3}
                                        value={state.description}
                                        onChange={handleFormChange}
                                        id="description"
                                    />
                                </label>
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

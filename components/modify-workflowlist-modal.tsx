import React, {useState} from "react";
import {UpdateWorkflowListEntity, WorkflowList, WorkflowListType} from "utils/models";


interface ModifyWorkflowListModalProps {
    show
    closeModal
    modifyType: WorkflowListType
    workflowList: WorkflowList
    modifyWorkflowList
}

const ModifyWorkflowListModal = ({
                                     show,
                                     closeModal,
                                     modifyType,
                                     workflowList,
                                     modifyWorkflowList
                                 }: ModifyWorkflowListModalProps): JSX.Element => {

    const initUpdateWorkflowListEntity: UpdateWorkflowListEntity = {
        newTitle: workflowList.title,
        newDescription: workflowList.description ? workflowList.description : ""
    }
    const showHideStyle = show ? {display: "block"} : {display: "none"};

    const [state, setState] = useState(initUpdateWorkflowListEntity)

    const handleFormChange = (event) => {
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
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                    Modify {modifyType}
                                </h3>
                                <div className="mt-2">
                                    <form action="/" method="post">
                                        <div className="flex flex-col mb-4">
                                            <label>New Title</label>
                                            <input className="border" type="text" value={state.newTitle}
                                                   onChange={handleFormChange} id="newTitle"/>
                                        </div>
                                        <div className="flex flex-col mb-4">
                                            <label>New Description</label>
                                            <input className="border" type="text" value={state.newDescription}
                                                   onChange={handleFormChange} id="newDescription"/>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button"
                                disabled={state.newTitle === workflowList.title && state.newDescription === workflowList.description}
                                onClick={() => {
                                    modifyWorkflowList(workflowList.uuid, state).then(res => {
                                        closeModal()
                                    })
                                }}
                                className="disabled:opacity-50 disabled:cursor-not-allowed w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                closeModal()
                                setState(initUpdateWorkflowListEntity)
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

export default ModifyWorkflowListModal

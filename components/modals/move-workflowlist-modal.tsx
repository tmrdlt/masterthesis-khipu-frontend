import React from "react";
import {WorkflowList, WorkflowListType} from "utils/models";


interface MoveWorkflowListModalProps {
    show
    closeModal
    selectWorkflowListToMove
}

const MoveWorkflowListModal = ({show, closeModal, selectWorkflowListToMove}: MoveWorkflowListModalProps): JSX.Element => {

    const showHideStyle = show ? {display: "block"} : {display: "none"};

    return (
        <div style={showHideStyle}
             className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"/>
                </div>
                <div
                    className="bg-transparent transform transition-all">
                    <button
                        type="button"
                        onClick={() => {
                            closeModal()
                            selectWorkflowListToMove(null);
                        }}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >Cancel moving
                    </button>
                </div>

            </div>
        </div>
    )
}

export default MoveWorkflowListModal
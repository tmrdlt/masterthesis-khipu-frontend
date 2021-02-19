import {ConvertWorkflowListEntity, WorkflowList, WorkflowListType} from "utils/models";
import React from "react";

interface IButtonsMenuProps {
    workflowList: WorkflowList
    removeWorkflowList
    selectWorkflowListToMove
    openModifyModal
    openMoveModal
    convertWorkflowList?
    openCreateModal?
}

const ButtonsMenu = ({
                         workflowList,
                         removeWorkflowList,
                         convertWorkflowList,
                         selectWorkflowListToMove,
                         openCreateModal,
                         openModifyModal,
                         openMoveModal
                     }: IButtonsMenuProps): JSX.Element => {

    let bgColorClassName = ""
    if (workflowList.usageType == "BOARD") {
        bgColorClassName = "bg-blue-200"
    } else if (workflowList.usageType == "LIST") {
        bgColorClassName = "bg-red-200"
    } else if (workflowList.usageType == "ITEM") {
        bgColorClassName = "bg-gray-200"
    }

    return (
        <div className="flex justify-end m-1">
            <div
                className={"flex justify-center items-center w-30 h-8 border border-gray-600 rounded " + bgColorClassName}>
                {(workflowList.usageType == "BOARD" || workflowList.usageType == "LIST") &&
                <button
                    type="button"
                    onClick={() => {
                        openCreateModal()
                    }}
                    className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded m-1 p-1 w-6 h-6"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                </button>
                }
                <button type="button"
                        onClick={() => {
                            openModifyModal()
                        }}
                        className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded m-1 p-1 w-6 h-6"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                </button>
                {workflowList.usageType == "BOARD" &&
                <button type="button"
                        onClick={() => {
                            const cwle: ConvertWorkflowListEntity = {newListType: WorkflowListType.LIST}
                            convertWorkflowList(workflowList.uuid, cwle)
                        }}
                        className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded m-1 p-1 w-6 h-6"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                </button>
                }
                {workflowList.usageType == "LIST" &&
                <button type="button"
                        onClick={() => {
                            const cwle: ConvertWorkflowListEntity = {newListType: WorkflowListType.BOARD}
                            convertWorkflowList(workflowList.uuid, cwle)
                        }}
                        className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded m-1 p-1 w-6 h-6"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                </button>
                }
                <button type="button"
                        onClick={() => {
                            selectWorkflowListToMove(workflowList);
                            openMoveModal();
                        }}
                        className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded m-1 p-1 w-6 h-6"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                </button>

                <button type="button"
                        onClick={() => {
                            removeWorkflowList(workflowList.uuid)
                        }}
                        className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded m-1 p-1 w-6 h-6"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ButtonsMenu

import {ConvertWorkflowListEntity, WorkflowList, WorkflowListType} from "utils/models";
import React from "react";
import {Menu, MenuButton, MenuItem, MenuList} from "@reach/menu-button";
import "@reach/menu-button/styles.css";

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

    return (


        <div className="flex">
            <div
                className={"flex justify-center items-center h-8"}>
                <button type="button"
                        onClick={() => {
                            selectWorkflowListToMove(workflowList);
                            openMoveModal();
                        }}
                        className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded p-1 w-6 h-6"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
                    </svg>
                </button>
                <Menu>
                    <MenuButton
                        className="bg-transparent hover:bg-gray-600 text-gray-600 hover:text-white rounded p-1 w-6 h-6"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </MenuButton>
                    <MenuList>
                        {(workflowList.usageType == WorkflowListType.BOARD || workflowList.usageType == WorkflowListType.LIST) &&
                        <MenuItem onSelect={() => {
                            openCreateModal()
                        }}>
                            Add child
                        </MenuItem>
                        }
                        <MenuItem onSelect={() => {
                            openModifyModal()
                        }}>
                            Modify
                        </MenuItem>
                        {workflowList.usageType == WorkflowListType.BOARD &&
                        <MenuItem onSelect={() => {
                            const cwle: ConvertWorkflowListEntity = {newListType: WorkflowListType.LIST}
                            convertWorkflowList(workflowList.uuid, cwle)
                        }}>
                            Convert to list
                        </MenuItem>
                        }
                        {workflowList.usageType == WorkflowListType.LIST &&
                        <MenuItem onSelect={() => {
                            const cwle: ConvertWorkflowListEntity = {newListType: WorkflowListType.BOARD}
                            convertWorkflowList(workflowList.uuid, cwle)
                        }}>
                            Convert to board
                        </MenuItem>
                        }
                        <MenuItem onSelect={() => {
                            removeWorkflowList(workflowList.uuid)
                        }}>
                            Delete
                        </MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </div>
    );
};

export default ButtonsMenu

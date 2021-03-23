import React, {useEffect, useState} from "react";
import {
    TemporalConstraint,
    TemporalConstraintType,
    UpdateWorkflowListEntity,
    WorkflowList,
    WorkflowListSimple
} from "utils/models";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {compareDateOptions} from "utils/date-util";
import {getOptionalString} from "utils/optional-util";

interface ModifyItemModalProps {
    show
    closeModal
    workflowList: WorkflowList
    isInsideTemporalConstraintBoard: boolean
    boardChildLists: Array<WorkflowListSimple>
    boardChildItems: Array<WorkflowListSimple>
    modifyWorkflowList
    setTemporalConstraint
}

const ModifyItemModal = ({
                             show,
                             closeModal,
                             workflowList,
                             isInsideTemporalConstraintBoard,
                             boardChildLists,
                             boardChildItems,
                             modifyWorkflowList,
                             setTemporalConstraint
                         }: ModifyItemModalProps): JSX.Element => {
    // STATE
    const initUpdateItemEntity: UpdateWorkflowListEntity = {
        newTitle: workflowList.title,
        newDescription: getOptionalString(workflowList.description),
        isTemporalConstraintBoard: workflowList.isTemporalConstraintBoard
    }
    const initTempConstraint: TemporalConstraint = workflowList.temporalConstraint ? {
        temporalConstraintType: workflowList.temporalConstraint.temporalConstraintType,
        dueDate: workflowList.temporalConstraint.dueDate,
        connectedWorkflowListApiId: getOptionalString(workflowList.temporalConstraint.connectedWorkflowListApiId)
    } : {
        temporalConstraintType: TemporalConstraintType.noConstraint,
        dueDate: null,
        connectedWorkflowListApiId: ""
    }

    const [updateItemEntity, setUpdateItemEntity] = useState(initUpdateItemEntity)
    const [tempConstraint, setTempConstraint] = useState(initTempConstraint)

    // DYNAMIC CLASSES
    const showHideClass = show ? "" : "hidden";

    // FUNCTIONS
    const handleFormChange = (event) => {
        const newState = {...updateItemEntity, [event.target.id]: event.target.value}
        setUpdateItemEntity(newState)
    }
    const handleRadioButtonChange = (event) => {
        const tempConstraintType: TemporalConstraintType = event.target.value
        setTempConstraint({
            temporalConstraintType: tempConstraintType,
            dueDate: null,
            connectedWorkflowListApiId: ""
        })
    }

    const handleSelectionChange = (event) => {
        if (event.target.value == "0") {
            const newState = {...tempConstraint, connectedWorkflowListApiId: ""}
            setTempConstraint(newState)
        } else {
            const newState = {...tempConstraint, connectedWorkflowListApiId: event.target.value}
            setTempConstraint(newState)
        }
    }

    const handleDatePickerChange = (date) => {
        const newState = {...tempConstraint, dueDate: date}
        setTempConstraint(newState)
    }

    const workflowListUnchanged = (): boolean => {
        return updateItemEntity.newTitle == workflowList.title
            && updateItemEntity.newDescription == getOptionalString(workflowList.description)
    }

    const temporalConstraintUnchanged = (): boolean => {
        return workflowList.temporalConstraint == null
            || (tempConstraint.temporalConstraintType == workflowList.temporalConstraint.temporalConstraintType
                && compareDateOptions(tempConstraint.dueDate, workflowList.temporalConstraint.dueDate)
                && tempConstraint.connectedWorkflowListApiId === getOptionalString(workflowList.temporalConstraint.connectedWorkflowListApiId))
    }

    const temporalConstraintFormInvalid = (): boolean => {
        if (tempConstraint.temporalConstraintType == TemporalConstraintType.itemToBeInList) {
            return !tempConstraint.dueDate
                || !tempConstraint.connectedWorkflowListApiId
        } else if (tempConstraint.temporalConstraintType == TemporalConstraintType.dependsOn) {
            return !tempConstraint.connectedWorkflowListApiId
        } else {
            return false
        }
    }

    return (
        <div className={showHideClass}>
            {/* https://tailwindcomponents.com/component/modal-1 */}
            <div
                className="h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-gray-500 bg-opacity-75">
                <div
                    className="bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">

                    { /* This div is taken from https://tailwindcss-forms.vercel.app/ simple --> */}
                    <div className="m-5">
                        <h3 className="font-bold">Modify Item</h3>
                        <div className="mt-4 w-full">
                            <div className="grid grid-cols-1 gap-4 text-sm">
                                <label className="block">
                                    <span className="text-gray-700">New title</span>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                        value={updateItemEntity.newTitle}
                                        onChange={handleFormChange}
                                        id="newTitle"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">New description</span>
                                    <textarea
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                        rows={3}
                                        value={updateItemEntity.newDescription}
                                        onChange={handleFormChange}
                                        id="newDescription"
                                    />
                                </label>
                                {isInsideTemporalConstraintBoard &&
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center">
                                        <label className="inline-flex items-center mr-3">
                                            <input type="radio"
                                                   value={TemporalConstraintType.noConstraint}
                                                   id="temporalConstraintType"
                                                   checked={tempConstraint.temporalConstraintType === TemporalConstraintType.noConstraint}
                                                   onChange={handleRadioButtonChange}
                                                   className="h-4 w-4"/>
                                            <span className="ml-1">No constraint</span>
                                        </label>
                                        <label className="inline-flex items-center mr-3">
                                            <input type="radio"
                                                   value={TemporalConstraintType.itemToBeInList}
                                                   id="temporalConstraintType"
                                                   checked={tempConstraint.temporalConstraintType === TemporalConstraintType.itemToBeInList}
                                                   onChange={handleRadioButtonChange}
                                                   className="h-4 w-4"/>
                                            <span className="ml-1">Due date</span>
                                        </label>
                                        <label className="inline-flex items-center mr-3">
                                            <input type="radio"
                                                   value={TemporalConstraintType.dependsOn}
                                                   id="temporalConstraintType"
                                                   checked={tempConstraint.temporalConstraintType === TemporalConstraintType.dependsOn}
                                                   onChange={handleRadioButtonChange}
                                                   className="h-4 w-4"/>
                                            <span className="ml-1">Depends On</span>
                                        </label>
                                    </div>
                                    {tempConstraint.temporalConstraintType === TemporalConstraintType.itemToBeInList &&
                                    <div className="grid grid-cols-1 gap-4">
                                        <label className="block">
                                            <span className="text-gray-700">Should be in List</span>
                                            <select
                                                className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                                value={tempConstraint.connectedWorkflowListApiId}
                                                onChange={handleSelectionChange}
                                            >
                                                <option className="opacity-40" key={0} value={"0"}>No list selected
                                                </option>
                                                {
                                                    boardChildLists.map(simpleList =>
                                                        <option key={simpleList.apiId}
                                                                value={simpleList.apiId}>{simpleList.title}</option>
                                                    )
                                                }
                                            </select>
                                        </label>
                                        <div className="grid">
                                            <div className="flex place-content-between">
                                            <span
                                                className="text-gray-700">at due date</span>
                                                <button className="text-gray-700"
                                                        onClick={() => {
                                                            handleDatePickerChange(null);
                                                        }}>
                                                    &#x2715; Clear date
                                                </button>
                                            </div>
                                            <DatePicker
                                                className="disabled:opacity-40 disabled:cursor-not-allowed mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                                selected={tempConstraint ? tempConstraint.dueDate : null}
                                                onChange={date => handleDatePickerChange(date)}
                                                disabled={!tempConstraint}
                                                placeholderText="No due date set"
                                                showTimeSelect
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                timeFormat="HH:mm"
                                                dateFormat="dd.MM.yyyy, HH:mm"
                                            />
                                        </div>
                                    </div>
                                    }
                                    {tempConstraint.temporalConstraintType === TemporalConstraintType.dependsOn &&
                                    <label className="block">
                                        <span className="text-gray-700">Cannot be finished before item</span>
                                        <select
                                            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                            value={tempConstraint.connectedWorkflowListApiId}
                                            onChange={handleSelectionChange}
                                        >
                                            <option key={0} value={"0"}>No item selected</option>
                                            {
                                                boardChildItems.map(simpleItem =>
                                                    <option key={simpleItem.apiId + 1}
                                                            value={simpleItem.apiId}>{simpleItem.title}</option>
                                                )
                                            }
                                        </select>
                                    </label>
                                    }
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                        <button type="button"
                                disabled={workflowListUnchanged() && temporalConstraintUnchanged() || temporalConstraintFormInvalid()}
                                onClick={() => {
                                    if (!workflowListUnchanged()) {
                                        modifyWorkflowList(workflowList.uuid, updateItemEntity).then(res => {
                                            closeModal()
                                        })
                                    }
                                    if (!temporalConstraintUnchanged()) {
                                        setTemporalConstraint(workflowList.uuid, tempConstraint).then(res => {
                                            closeModal()
                                        })
                                    }
                                }}
                                className="disabled:opacity-50 disabled:cursor-not-allowed w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                closeModal()
                                setUpdateItemEntity(initUpdateItemEntity)
                                setTempConstraint(initTempConstraint)
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

export default ModifyItemModal

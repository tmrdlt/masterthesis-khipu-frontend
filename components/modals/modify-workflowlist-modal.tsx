import React, {useEffect, useState} from "react";
import {
    TemporalConstraint,
    TemporalConstraintType,
    UpdateWorkflowListEntity,
    WorkflowList,
    WorkflowListType
} from "utils/models";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface ModifyWorkflowListModalProps {
    show
    closeModal
    modifyType: WorkflowListType
    workflowList: WorkflowList
    modifyWorkflowList
    setTemporalConstraint
}

const ModifyWorkflowListModal = ({
                                     show,
                                     closeModal,
                                     modifyType,
                                     workflowList,
                                     modifyWorkflowList,
                                     setTemporalConstraint
                                 }: ModifyWorkflowListModalProps): JSX.Element => {

    const showHideClass = show ? "" : "hidden";

    const initUpdateWorkflowListEntity: UpdateWorkflowListEntity = {
        newTitle: workflowList.title,
        newDescription: workflowList.description ? workflowList.description : "",
        isTemporalConstraintBoard: workflowList.isTemporalConstraintBoard
    }

    const [state, setState] = useState(initUpdateWorkflowListEntity)

    const toggleChange = () => {
        const newState = {...state, isTemporalConstraintBoard: !state.isTemporalConstraintBoard}
        setState(newState)
    }
    const handleFormChange = (event) => {
        const newState = {...state, [event.target.id]: event.target.value}
        setState(newState)
    }
    const opacityStyle = !state.isTemporalConstraintBoard ? " opacity-40 cursor-not-allowed" : ""

    const [dueDate, setDueDate] = useState(null)

    useEffect(() => {
        if (workflowList.temporalConstraint && workflowList.temporalConstraint.dueDate) {
            setDueDate(new Date(workflowList.temporalConstraint.dueDate))
        }
    }, [workflowList])

    return (
        <div className={showHideClass}>
            {/* https://tailwindcomponents.com/component/modal-1 */}
            <div
                className="h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-gray-500 bg-opacity-75">
                <div
                    className="bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">

                    { /* This div is taken from https://tailwindcss-forms.vercel.app/ simple --> */}
                    <div className="m-5">
                        <h3 className="font-bold">Modify {modifyType}</h3>
                        <div className="mt-4 w-full">
                            <div className="grid grid-cols-1 gap-4 text-sm">
                                <label className="block">
                                    <span className="text-gray-700">New title</span>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                        value={state.newTitle}
                                        onChange={handleFormChange}
                                        id="newTitle"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">New description</span>
                                    <textarea
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                        rows={3}
                                        value={state.newDescription}
                                        onChange={handleFormChange}
                                        id="newDescription"
                                    />
                                </label>
                                {workflowList.usageType == WorkflowListType.BOARD &&
                                <div className="block">
                                    <div className="mt-2">
                                        <div>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                    id="isTemporalConstraintBoard"
                                                    checked={state.isTemporalConstraintBoard ? state.isTemporalConstraintBoard : false}
                                                    onChange={toggleChange}
                                                />
                                                <span className="ml-2">Is temporal constraint board</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                }
                                {workflowList.usageType == WorkflowListType.BOARD &&
                                <div className="grid">
                                    <div className="flex place-content-between">
                                        <span className={"text-gray-700" + opacityStyle}>Set due date for board</span>
                                        <button className={"text-gray-700" + opacityStyle}
                                                onClick={() => {
                                            setDueDate(null);
                                        }}>
                                            &#x2715; Clear date
                                        </button>

                                    </div>
                                    <DatePicker
                                        className="disabled:opacity-40 disabled:cursor-not-allowed mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                        selected={dueDate}
                                        onChange={date => setDueDate(date)}
                                        disabled={!state.isTemporalConstraintBoard}
                                        placeholderText="No due date set"
                                        showTimeSelect
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        timeFormat="HH:mm"
                                        dateFormat="dd.MM.yyyy, HH:mm"
                                    />
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                        <button type="button"
                                disabled={state.newTitle === workflowList.title
                                && state.newDescription === workflowList.description
                                && state.isTemporalConstraintBoard == workflowList.isTemporalConstraintBoard
                                && dueDate == (workflowList.temporalConstraint ? workflowList.temporalConstraint.dueDate : null)}
                                onClick={() => {
                                    modifyWorkflowList(workflowList.uuid, state)
                                    const entity: TemporalConstraint = {
                                        temporalConstraintType: TemporalConstraintType.projectDueDate,
                                        dueDate: dueDate
                                    }
                                    setTemporalConstraint(workflowList.uuid, entity).then(res => {
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

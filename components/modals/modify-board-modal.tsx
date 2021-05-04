import React, {useEffect, useState} from "react";
import {TemporalConstraint, TemporalConstraintType, UpdateWorkflowListEntity, WorkflowList} from "utils/models";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {compareDateOptions} from "utils/date-util";
import {getOptionalString} from "utils/optional-util";

interface ModifyBoardModalProps {
    show
    closeModal
    workflowList: WorkflowList
    modifyWorkflowList
    setTemporalConstraint
}

const ModifyBoardModal = ({
                              show,
                              closeModal,
                              workflowList,
                              modifyWorkflowList,
                              setTemporalConstraint
                          }: ModifyBoardModalProps): JSX.Element => {
    // STATE
    const initUpdateBoardEntity: UpdateWorkflowListEntity = {
        newTitle: workflowList.title,
        newDescription: workflowList.description ? workflowList.description : "",
        isTemporalConstraintBoard: workflowList.isTemporalConstraintBoard
    }
    const initDueDate: Date | null =
        workflowList.temporalConstraint ? workflowList.temporalConstraint.endDate : null

    const [updateBoardEntity, setUpdateBoardEntity] = useState(initUpdateBoardEntity)
    const [dueDate, setDueDate] = useState(initDueDate)

    useEffect(() => {
        if (workflowList.temporalConstraint && workflowList.temporalConstraint.endDate) {
            setDueDate(workflowList.temporalConstraint.endDate)
        }
    }, [workflowList])

    // DYNAMIC CLASSES
    const showHideClass = show ? "" : "hidden";
    const opacityAndCursorNotAllowedClass = !updateBoardEntity.isTemporalConstraintBoard ? " opacity-40 cursor-not-allowed" : ""

    // FUNCTIONS
    const toggleChange = () => {
        const newState = {...updateBoardEntity, isTemporalConstraintBoard: !updateBoardEntity.isTemporalConstraintBoard}
        setUpdateBoardEntity(newState)
    }
    const handleFormChange = (event) => {
        const newState = {...updateBoardEntity, [event.target.id]: event.target.value}
        setUpdateBoardEntity(newState)
    }

    const workflowListUnchanged = (): boolean => {
        return updateBoardEntity.newTitle === workflowList.title
            && updateBoardEntity.newDescription === getOptionalString(workflowList.description)
            && updateBoardEntity.isTemporalConstraintBoard == workflowList.isTemporalConstraintBoard
    }

    const temporalConstraintUnchanged = (): boolean => {
        return compareDateOptions(dueDate, workflowList.temporalConstraint ? workflowList.temporalConstraint.endDate : null)

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
                        <h3 className="font-bold">Modify Board</h3>
                        <div className="mt-4 w-full">
                            <div className="grid grid-cols-1 gap-4 text-sm">
                                <label className="block">
                                    <span className="text-gray-700">New title</span>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                        value={updateBoardEntity.newTitle}
                                        onChange={handleFormChange}
                                        id="newTitle"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">New description</span>
                                    <textarea
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                        rows={3}
                                        value={updateBoardEntity.newDescription}
                                        onChange={handleFormChange}
                                        id="newDescription"
                                    />
                                </label>
                                <div className="block">
                                    <div className="mt-2">
                                        <div>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                    id="isTemporalConstraintBoard"
                                                    checked={updateBoardEntity.isTemporalConstraintBoard ? updateBoardEntity.isTemporalConstraintBoard : false}
                                                    onChange={toggleChange}
                                                />
                                                <span className="ml-2">Is temporal constraint board</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid">
                                    <div className="flex place-content-between">
                                        <span className={"text-gray-700" + opacityAndCursorNotAllowedClass}>Set due date for board</span>
                                        <button className={"text-gray-700" + opacityAndCursorNotAllowedClass}
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
                                        disabled={!updateBoardEntity.isTemporalConstraintBoard}
                                        placeholderText="No due date set"
                                        showTimeSelect
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        timeFormat="HH:mm"
                                        dateFormat="dd.MM.yyyy, HH:mm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                        <button type="button"
                                disabled={workflowListUnchanged() && temporalConstraintUnchanged()}
                                onClick={() => {
                                    if (!workflowListUnchanged()) {
                                        modifyWorkflowList(workflowList.apiId, updateBoardEntity).then(res => {
                                            closeModal()
                                        })
                                    }
                                    if (!temporalConstraintUnchanged()) {
                                        const entity: TemporalConstraint = {
                                            endDate: dueDate
                                        }
                                        setTemporalConstraint(workflowList.apiId, entity).then(res => {
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
                                setUpdateBoardEntity(initUpdateBoardEntity)
                                setDueDate(initDueDate)
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

export default ModifyBoardModal

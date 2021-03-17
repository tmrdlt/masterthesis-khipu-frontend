import React, {useState} from "react";
import {formatDateInput} from "utils/date-util";


interface ConfigBoardTempConstraintModalProps {
    show
    closeModal
    isTemporalConstraintBoard: boolean
    dueDate?: Date
    //configTemporalConstraint
}

const ConfigBoardTempConstraintModal = ({
                                            show,
                                            closeModal,
                                            isTemporalConstraintBoard,
                                            dueDate,
                                            //configTemporalConstraint
                                        }: ConfigBoardTempConstraintModalProps): JSX.Element => {
    const initConfigTempConstraintEntity = {
        isTemporalConstraintBoard: isTemporalConstraintBoard,
        dueDate: formatDateInput(dueDate)
    }
    const showHideStyle = show ? {display: "block"} : {display: "none"};

    const [state, setState] = useState(initConfigTempConstraintEntity)

    const toggleChange = () => {
        const newState = {...state, isTemporalConstraintBoard: !state.isTemporalConstraintBoard}
        setState(newState)
    }
    const handleFormChange = (event) => {
        const newState = {...state, [event.target.id]: event.target.value}
        setState(newState)
    }
    return (
        <div style={showHideStyle}
             className="fixed z-10 inset-0 overflow-y-auto">
            <div
                className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"/>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    role="dialog" aria-modal="true" aria-labelledby="modal-headline">

                    { /* This div is taken from https://tailwindcss-forms.vercel.app/ simple --> */}
                    <div className="m-5">
                        <h3 className="font-bold">Update temporal constraints</h3>
                        <div className="mt-4 w-full">
                            <div className="grid grid-cols-1 gap-4 text-sm">
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
                                <label className="block">
                                    <span className="text-gray-700">Set due date for board</span>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                        id="dueDate"
                                        value={state.dueDate}
                                        onChange={handleFormChange}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button"
                                disabled={state.isTemporalConstraintBoard === isTemporalConstraintBoard
                                && state.dueDate === formatDateInput(dueDate)}
                                onClick={() => {
                                    console.log("save", state.isTemporalConstraintBoard, state.dueDate)
                                }}
                                className="disabled:opacity-50 disabled:cursor-not-allowed w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                closeModal()
                                setState(initConfigTempConstraintEntity)
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

export default ConfigBoardTempConstraintModal

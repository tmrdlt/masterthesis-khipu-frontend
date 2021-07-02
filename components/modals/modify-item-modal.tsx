import React, {useState} from "react";
import {
    TemporalResource,
    TemporalConstraintType,
    UpdateWorkflowListEntity,
    WorkflowList,
    WorkflowListSimple
} from "utils/models";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {compareDateOptions, formatDuration} from "utils/date-util";
import {getOptionalString} from "utils/optional-util";
import {isNoConstraint} from "utils/temp-constraint-util";
import timeDurationsInMinutes from "utils/globals";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


interface ModifyItemModalProps {
    show
    closeModal
    workflowList: WorkflowList
    isInsideTemporalConstraintBoard: boolean
    boardChildLists: Array<WorkflowListSimple>
    modifyWorkflowList
    modifyTemporalResource
}

const ModifyItemModal = ({
                             show,
                             closeModal,
                             workflowList,
                             isInsideTemporalConstraintBoard,
                             boardChildLists,
                             modifyWorkflowList,
                             modifyTemporalResource
                         }: ModifyItemModalProps): JSX.Element => {
    // STATE
    const initUpdateItemEntity: UpdateWorkflowListEntity = {
        newTitle: workflowList.title,
        newDescription: getOptionalString(workflowList.description),
        isTemporalConstraintBoard: workflowList.isTemporalConstraintBoard
    }
    const initTempResource: TemporalResource = workflowList.temporalResource ? {
        startDate: workflowList.temporalResource.startDate,
        endDate: workflowList.temporalResource.endDate,
        durationInMinutes: getOptionalString(workflowList.temporalResource.durationInMinutes),
        connectedWorkflowListApiId: getOptionalString(workflowList.temporalResource.connectedWorkflowListApiId)
    } : {
        startDate: null,
        endDate: null,
        durationInMinutes: null,
        connectedWorkflowListApiId: null
    }

    const [updateItemEntity, setUpdateItemEntity] = useState(initUpdateItemEntity)
    const [tempResource, setTempResource] = useState(initTempResource)

    // DYNAMIC CLASSES
    const showHideClass = show ? "" : "hidden";

    // FUNCTIONS
    const handleFormChange = (event) => {
        const newState = {...updateItemEntity, [event.target.id]: event.target.value}
        setUpdateItemEntity(newState)
    }

    const handleDatePickerChange = (date, key) => {
        const newState = {...tempResource, [key]: date}
        setTempResource(newState)
    }

    const handleTimeRequiredSelectionChange = (event) => {
        if (event.target.value == "0") {
            const newState = {...tempResource, durationInMinutes: ""}
            setTempResource(newState)
        } else {
            const newState = {...tempResource, durationInMinutes: event.target.value}
            setTempResource(newState)
        }
    }

    const workflowListUnchanged = (): boolean => {
        return updateItemEntity.newTitle == initUpdateItemEntity.newTitle
            && updateItemEntity.newDescription == initUpdateItemEntity.newDescription
    }

    const temporalResourceUnchanged = (): boolean => {
        return (compareDateOptions(tempResource.startDate, initTempResource.startDate)
            && compareDateOptions(tempResource.endDate, initTempResource.endDate)
            && tempResource.durationInMinutes == getOptionalString(initTempResource.durationInMinutes)
            && tempResource.connectedWorkflowListApiId === getOptionalString(initTempResource.connectedWorkflowListApiId))
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
                                    <span className="text-gray-700">Title</span>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                        value={updateItemEntity.newTitle}
                                        onChange={handleFormChange}
                                        id="newTitle"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">Description</span>
                                    <textarea
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                        rows={3}
                                        value={updateItemEntity.newDescription}
                                        onChange={handleFormChange}
                                        id="newDescription"
                                    />
                                </label>
                                <span className="text-gray-700">Resources</span>
                                <Tabs>
                                    <TabList>
                                        {isInsideTemporalConstraintBoard &&
                                        <Tab>Temporal</Tab>
                                        }
                                        <Tab>Generic</Tab>
                                        <Tab>User</Tab>
                                    </TabList>
                                    {isInsideTemporalConstraintBoard &&
                                    <TabPanel>
                                        <div className="grid grid-cols-1 gap-4">
                                            {!isNoConstraint(tempResource) &&
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="grid">
                                                    <div className="flex place-content-between">
                                            <span
                                                className="text-gray-700">Start date</span>
                                                        <button className="text-gray-700"
                                                                onClick={() => {
                                                                    handleDatePickerChange(null, "startDate");
                                                                }}>
                                                            &#x2715; Clear date
                                                        </button>
                                                    </div>
                                                    <DatePicker
                                                        className="disabled:opacity-40 disabled:cursor-not-allowed mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                                        selected={tempResource ? tempResource.startDate : null}
                                                        onChange={date => handleDatePickerChange(date, "startDate")}
                                                        selectsStart
                                                        startDate={tempResource.startDate}
                                                        endDate={tempResource.endDate}
                                                        maxDate={tempResource.endDate}
                                                        disabled={!tempResource}
                                                        placeholderText="No start date set"
                                                        showTimeSelect
                                                        timeIntervals={15}
                                                        timeCaption="Time"
                                                        timeFormat="HH:mm"
                                                        dateFormat="dd.MM.yyyy, HH:mm"
                                                    />
                                                </div>
                                                <div className="grid">
                                                    <div className="flex place-content-between">
                                            <span
                                                className="text-gray-700">Due date</span>
                                                        <button className="text-gray-700"
                                                                onClick={() => {
                                                                    handleDatePickerChange(null, "endDate");
                                                                }}>
                                                            &#x2715; Clear date
                                                        </button>
                                                    </div>
                                                    <DatePicker
                                                        className="disabled:opacity-40 disabled:cursor-not-allowed mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                                        selected={tempResource ? tempResource.endDate : null}
                                                        onChange={date => handleDatePickerChange(date, "endDate")}
                                                        selectsEnd
                                                        startDate={tempResource.startDate}
                                                        endDate={tempResource.endDate}
                                                        minDate={tempResource.startDate}
                                                        disabled={!tempResource}
                                                        placeholderText="No due date set"
                                                        showTimeSelect
                                                        timeIntervals={15}
                                                        timeCaption="Time"
                                                        timeFormat="HH:mm"
                                                        dateFormat="dd.MM.yyyy, HH:mm"
                                                    />
                                                </div>
                                                <label className="block">
                                                    <span className="text-gray-700">Time required</span><select
                                                    className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                                    value={tempResource.durationInMinutes}
                                                    onChange={handleTimeRequiredSelectionChange}
                                                >
                                                    <option className="opacity-40" key={0} value={"0"}>None
                                                    </option>
                                                    {
                                                        timeDurationsInMinutes.map(durationInMinutes =>
                                                            <option key={durationInMinutes}
                                                                    value={durationInMinutes}>{formatDuration(durationInMinutes.toString())}</option>
                                                        )
                                                    }
                                                </select>
                                                </label>
                                            </div>
                                            }
                                        </div>
                                    </TabPanel>
                                    }
                                    <TabPanel>
                                        <h2>Any content 2</h2>
                                    </TabPanel>
                                    <TabPanel>
                                        <h2>Any content 2</h2>
                                    </TabPanel>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                        <button type="button"
                                disabled={workflowListUnchanged() && temporalResourceUnchanged()}
                                onClick={() => {
                                    if (!workflowListUnchanged()) {
                                        modifyWorkflowList(workflowList.apiId, updateItemEntity).then(res => {
                                            closeModal()
                                        })
                                    }
                                    if (!temporalResourceUnchanged()) {

                                        const entity = {
                                            ...tempResource,
                                            durationInMinutes: tempResource.durationInMinutes === "" ? null : parseInt(tempResource.durationInMinutes),
                                            connectedWorkflowListApiId: tempResource.connectedWorkflowListApiId === "" ? null : tempResource.connectedWorkflowListApiId
                                        }
                                        modifyTemporalResource(workflowList.apiId, entity).then(res => {
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
                                setTempResource(initTempResource)
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

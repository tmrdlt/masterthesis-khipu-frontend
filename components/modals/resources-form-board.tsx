import { WorkflowListResource } from 'utils/models'
import React from 'react'
import DatePicker from 'react-datepicker'

interface BoardResourcesFormProps {
  isTemporalConstraintBoard: boolean
  resource: WorkflowListResource
  setResource
}

const ResourcesFormBoard = ({
                                isTemporalConstraintBoard,
                                resource,
                                setResource
                            }: BoardResourcesFormProps): JSX.Element => {

    // DYNAMIC CLASSES
    const opacityAndCursorNotAllowedClass = !isTemporalConstraintBoard
        ? ' opacity-40 cursor-not-allowed'
        : ''

    const handleDatePickerChange = (date, key) => {
        const newState = {
            ...resource,
            temporal: {
                ...resource.temporal,
                [key]: date,
            },
        }
        setResource(newState)
    }

    return (
        <div className="grid">
            <div className="flex place-content-between">
                    <span className={'text-gray-700' + opacityAndCursorNotAllowedClass}>
                      Set due date for board
                    </span>
                <button
                    className={'text-gray-700' + opacityAndCursorNotAllowedClass}
                    onClick={() => {
                        handleDatePickerChange(null, 'endDate')
                    }}
                >
                    &#x2715; Clear date
                </button>
            </div>
            <DatePicker
                className="disabled:opacity-40 disabled:cursor-not-allowed mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                selected={resource.temporal ? resource.temporal.endDate : null}
                onChange={(date) => handleDatePickerChange(date, 'endDate')}
                disabled={!isTemporalConstraintBoard}
                placeholderText="No due date set"
                showTimeSelect
                timeIntervals={15}
                timeCaption="Time"
                timeFormat="HH:mm"
                dateFormat="dd.MM.yyyy, HH:mm"
                autocomplete="off"
                id="dueDate"
                name="dueDate"
            />
        </div>
    )
}

export default ResourcesFormBoard

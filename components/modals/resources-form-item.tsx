import CalendarIcon, {
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  FlagIcon,
  UserIcon,
} from 'components/icons'
import timeDurationsInMinutes from 'utils/globals'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import DatePicker from 'react-datepicker'
import { formatDuration } from 'utils/date-util'
import React from 'react'
import { NumericResource, TextualResource, WorkflowListResource } from 'utils/models'
import { useUsers } from 'utils/swr-util'
import AddButton from 'components/buttons/add-button'
import { getRequiredClass } from 'utils/style-elements'

interface ItemResourcesFormProps {
  resource: WorkflowListResource
  setResource
}

const ResourcesFormItem = ({ resource, setResource }: ItemResourcesFormProps): JSX.Element => {
  const { users, isLoading, isError } = useUsers()

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

  const handleTimeRequiredSelectionChange = (event) => {
    if (event.target.value === 0) {
      const newState = {
        ...resource,
        temporal: {
          ...resource.temporal,
          durationInMinutes: 0,
        },
      }
      setResource(newState)
    } else {
      const newState = {
        ...resource,
        temporal: {
          ...resource.temporal,
          durationInMinutes: parseInt(event.target.value),
        },
      }
      setResource(newState)
    }
  }

  const handleNumericResourceFormChange = (event, index) => {
    const newState = { ...resource }
    let newElement: NumericResource
    if (event.target.id === 'label') {
      newElement = { ...newState.numeric[index], label: event.target.value }
      newState.numeric.splice(index, 1, newElement)
    } else {
      const regex = /^[0-9\b]+$/
      if (regex.test(event.target.value)) {
        newElement = { ...newState.numeric[index], value: parseFloat(event.target.value) }
        console.log(newElement)
        newState.numeric.splice(index, 1, newElement)
      } else if (event.target.value === '') {
        newElement = { ...newState.numeric[index], value: event.target.value }
        newState.numeric.splice(index, 1, newElement)
      }
    }
    setResource(newState)
  }

  const addEmptyNumericResource = () => {
    const newState = { ...resource }
    // @ts-ignore
    newState.numeric.push({ label: '', value: '' })
    setResource(newState)
  }

  const removeNumericResource = (index: number) => {
    const newState = { ...resource }
    newState.numeric.splice(index, 1)
    setResource(newState)
  }

  const handleTextualResourceFormChange = (event, index) => {
    const newState = { ...resource }
    let newElement: TextualResource
    if (event.target.id === 'label') {
      newElement = { ...newState.textual[index], label: event.target.value }
    } else {
      newElement = { ...newState.textual[index], value: event.target.value }
    }
    newState.textual.splice(index, 1, newElement)
    setResource(newState)
  }

  const addEmptyTextualResource = () => {
    const newState = { ...resource }
    newState.textual.push({ label: '', value: '' })
    setResource(newState)
  }

  const removeTextualResource = (index: number) => {
    const newState = { ...resource }
    newState.textual.splice(index, 1)
    setResource(newState)
  }

  const handleUserResourceFormChange = (event) => {
    const newState = {
      ...resource,
      user: {
        username: event.target.value,
      },
    }
    setResource(newState)
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      <span className="text-gray-700">Resources</span>
      <Tabs>
        <TabList>
          <Tab>
            <div className="inline-flex items-center">
              <div className="w-4 h-4 mr-1">
                <ClockIcon />
              </div>
              Temporal
            </div>
          </Tab>
          <Tab>
            <div className="inline-flex items-center">
              <div className="w-4 h-4 mr-1">
                <ChartBarIcon />
              </div>
              Numeric
            </div>
          </Tab>
          <Tab>
            <div className="inline-flex items-center">
              <div className="w-4 h-4 mr-1">
                <DocumentTextIcon />
              </div>
              Textual
            </div>
          </Tab>
          <Tab>
            <div className="inline-flex items-center">
              <div className="w-4 h-4 mr-1">
                <UserIcon />
              </div>
              User
            </div>
          </Tab>
        </TabList>
        <TabPanel>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid">
                <div className="flex place-content-between">
                  <div className="inline-flex items-center">
                    <div className="w-4 h-4 mr-1">
                      <CalendarIcon />
                    </div>
                    <span className="text-gray-700">Start date</span>
                  </div>
                  <button
                    className="text-gray-700"
                    onClick={(e) => {
                      e.preventDefault() // needed so react doesn't reload page
                      handleDatePickerChange(null, 'startDate')
                    }}
                  >
                    &#x2715; Clear date
                  </button>
                </div>
                <DatePicker
                  className="disabled:opacity-40 disabled:cursor-not-allowed mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                  selected={resource.temporal ? resource.temporal.startDate : null}
                  onChange={(date) => handleDatePickerChange(date, 'startDate')}
                  selectsStart
                  startDate={resource.temporal.startDate}
                  dueDate={resource.temporal.dueDate}
                  maxDate={resource.temporal.dueDate}
                  disabled={!resource.temporal}
                  placeholderText="No start date set"
                  showTimeSelect
                  timeIntervals={15}
                  timeCaption="Time"
                  timeFormat="HH:mm"
                  dateFormat="dd.MM.yyyy, HH:mm"
                  autocomplete="off"
                  id="startDate"
                  name="startDate"
                />
              </div>
              <div className="grid">
                <div className="flex place-content-between">
                  <div className="inline-flex items-center">
                    <div className="w-4 h-4 mr-1">
                      <FlagIcon />
                    </div>
                    <span className="text-gray-700">Due date</span>
                  </div>
                  <button
                    className="text-gray-700"
                    onClick={(e) => {
                      e.preventDefault() // needed so react doesn't reload page
                      handleDatePickerChange(null, 'dueDate')
                    }}
                  >
                    &#x2715; Clear date
                  </button>
                </div>
                <DatePicker
                  className="disabled:opacity-40 disabled:cursor-not-allowed mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                  selected={resource.temporal ? resource.temporal.dueDate : null}
                  onChange={(date) => handleDatePickerChange(date, 'dueDate')}
                  selectsEnd
                  startDate={resource.temporal.startDate}
                  dueDate={resource.temporal.dueDate}
                  minDate={resource.temporal.startDate}
                  disabled={!resource.temporal}
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
              <label className="block">
                <div className="inline-flex items-center">
                  <div className="w-4 h-4 mr-1">
                    <ClockIcon />
                  </div>
                  <span className="text-gray-700">Estimated time required</span>
                </div>
                <select
                  className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                  value={resource.temporal.durationInMinutes}
                  onChange={handleTimeRequiredSelectionChange}
                >
                  <option className="opacity-40" key={0} value={0}>
                    None
                  </option>
                  {timeDurationsInMinutes.map((durationInMinutes) => (
                    <option key={durationInMinutes} value={durationInMinutes}>
                      {formatDuration(durationInMinutes)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid grid-cols-1 gap-3">
            {resource.numeric.map((numericResource, index) => {
              return (
                <div className="flex items-center justify-between gap-4" key={index}>
                  <div className="grid grid-cols-2 w-full gap-4">
                    <input
                      type="text"
                      className={`block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-300 focus:ring-opacity-50 ${getRequiredClass(numericResource.label === '')}`}
                      value={numericResource.label}
                      placeholder="Label (required)"
                      onChange={(event) => {
                        handleNumericResourceFormChange(event, index)
                      }}
                      id="label"
                    />
                    <input
                      type="text"
                      className={`block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-300 focus:ring-opacity-50 ${getRequiredClass(numericResource.value.toString() === '')}`}
                      value={numericResource.value}
                      placeholder="Value (required, number)"
                      onChange={(event) => {
                        handleNumericResourceFormChange(event, index)
                      }}
                      id="value"
                    />
                  </div>
                  <button
                    className="text-gray-700"
                    onClick={() => {
                      removeNumericResource(index)
                    }}
                  >
                    &#x2715;
                  </button>
                </div>
              )
            })}
            <AddButton addString={'numeric resource'} addFunction={addEmptyNumericResource} />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid grid-cols-1 gap-3">
            {resource.textual.map((textualResource, index) => {
              return (
                <div className="flex items-center justify-between gap-4" key={index}>
                  <div className="grid grid-cols-2 w-full gap-4">
                    <input
                      type="text"
                      className={`block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-300 focus:ring-opacity-50 ${getRequiredClass(textualResource.label === '')}`}
                      value={textualResource.label}
                      placeholder="Label (required)"
                      onChange={(event) => {
                        handleTextualResourceFormChange(event, index)
                      }}
                      id="label"
                    />
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                      value={textualResource.value}
                      placeholder="Value"
                      onChange={(event) => {
                        handleTextualResourceFormChange(event, index)
                      }}
                      id="value"
                    />
                  </div>
                  <button
                    className="text-gray-700"
                    onClick={() => {
                      removeTextualResource(index)
                    }}
                  >
                    &#x2715;
                  </button>
                </div>
              )
            })}
            <AddButton addString={'textual resource'} addFunction={addEmptyTextualResource} />
          </div>
        </TabPanel>
        <TabPanel>
          <label className="block">
            <span className="text-gray-700">Assigned user</span>
            <select
              className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
              value={resource.user.username}
              onChange={handleUserResourceFormChange}
            >
              <option className="opacity-40" key={0} value={''}>
                None
              </option>
              {!isLoading &&
                !isError &&
                users.map((user) => (
                  <option key={user.username} value={user.username}>
                    {user.username}
                  </option>
                ))}
            </select>
          </label>
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default ResourcesFormItem

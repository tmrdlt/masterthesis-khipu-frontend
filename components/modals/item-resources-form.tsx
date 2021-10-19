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
import { NumericResource, TemporalResource, TextualResource, UserResource } from 'utils/models'
import { useUsers } from 'utils/swr-util'

interface ItemResourcesFormProps {
  temporalResource: TemporalResource
  numericResources: Array<NumericResource>
  textualResources: Array<TextualResource>
  userResource: UserResource
  setTemporalResource
  setNumericResources
  setTextualResources
  setUserResource
}

const ItemResourcesForm = ({
  temporalResource,
  numericResources,
  textualResources,
  userResource,
  setTemporalResource,
  setNumericResources,
  setTextualResources,
  setUserResource,
}: ItemResourcesFormProps): JSX.Element => {
  const { users, isLoading, isError } = useUsers()

  const handleDatePickerChange = (date, key) => {
    const newState = { ...temporalResource, [key]: date }
    setTemporalResource(newState)
  }

  const handleTimeRequiredSelectionChange = (event) => {
    if (event.target.value === 0) {
      const newState = { ...temporalResource, durationInMinutes: 0 }
      setTemporalResource(newState)
    } else {
      const newState = { ...temporalResource, durationInMinutes: parseInt(event.target.value) }
      setTemporalResource(newState)
    }
  }

  const handleNumericResourceFormChange = (event, index) => {
    const newState = [...numericResources]
    let newElement: NumericResource
    if (event.target.id === 'label') {
      newElement = { ...newState[index], label: event.target.value }
      newState.splice(index, 1, newElement)
    } else {
      const regex = /^[0-9\b]+$/
      if (regex.test(event.target.value)) {
        newElement = { ...newState[index], value: parseFloat(event.target.value) }
        console.log(newElement)
        newState.splice(index, 1, newElement)
      } else if (event.target.value === '') {
        newElement = { ...newState[index], value: event.target.value }
        newState.splice(index, 1, newElement)
      }
    }
    setNumericResources(newState)
  }

  const addEmptyNumericResource = () => {
    const newState = [...numericResources]
    // @ts-ignore
    newState.push({ label: '', value: '' })
    setNumericResources(newState)
  }

  const removeNumericResource = (index: number) => {
    const newState = [...numericResources]
    newState.splice(index, 1)
    setNumericResources(newState)
  }

  const handleTextualResourceFormChange = (event, index) => {
    const newState = [...textualResources]
    let newElement: TextualResource
    if (event.target.id === 'label') {
      newElement = { ...newState[index], label: event.target.value }
    } else {
      newElement = { ...newState[index], value: event.target.value }
    }
    newState.splice(index, 1, newElement)
    setTextualResources(newState)
  }

  const handleUserResourceFormChange = (event) => {
    const newState = { ...userResource, username: event.target.value }
    setUserResource(newState)
  }

  const addEmptyTextualResource = () => {
    const newState = [...textualResources]
    newState.push({ label: '', value: '' })
    setTextualResources(newState)
  }

  const removeTextualResource = (index: number) => {
    const newState = [...textualResources]
    newState.splice(index, 1)
    setTextualResources(newState)
  }

  return (
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
                selected={temporalResource ? temporalResource.startDate : null}
                onChange={(date) => handleDatePickerChange(date, 'startDate')}
                selectsStart
                startDate={temporalResource.startDate}
                endDate={temporalResource.endDate}
                maxDate={temporalResource.endDate}
                disabled={!temporalResource}
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
                    handleDatePickerChange(null, 'endDate')
                  }}
                >
                  &#x2715; Clear date
                </button>
              </div>
              <DatePicker
                className="disabled:opacity-40 disabled:cursor-not-allowed mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                selected={temporalResource ? temporalResource.endDate : null}
                onChange={(date) => handleDatePickerChange(date, 'endDate')}
                selectsEnd
                startDate={temporalResource.startDate}
                endDate={temporalResource.endDate}
                minDate={temporalResource.startDate}
                disabled={!temporalResource}
                placeholderText="No due date set"
                showTimeSelect
                timeIntervals={15}
                timeCaption="Time"
                timeFormat="HH:mm"
                dateFormat="dd.MM.yyyy, HH:mm"
                autocomplete="off"
                id="endDate"
                name="endDate"
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
                value={temporalResource.durationInMinutes}
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
        <div className="grid grid-cols-1 gap-4">
          {numericResources.map((numericResource, index) => {
            return (
              <div className="flex items-end" key={index}>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-gray-700">Label (required)</span>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                      value={numericResource.label}
                      placeholder="Label"
                      onChange={(event) => {
                        handleNumericResourceFormChange(event, index)
                      }}
                      id="label"
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Value (required)</span>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                      value={numericResource.value}
                      placeholder="Value"
                      onChange={(event) => {
                        handleNumericResourceFormChange(event, index)
                      }}
                      id="value"
                    />
                  </label>
                </div>
                <button
                  className="text-gray-700"
                  onClick={() => {
                    removeNumericResource(index)
                  }}
                >
                  &#x2715; Delete
                </button>
              </div>
            )
          })}
          <button
            type="button"
            onClick={() => {
              addEmptyNumericResource()
            }}
            className="bg-transparent hover:bg-gray-50 text-gray-500 border border-gray-500 rounded w-8 h-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </TabPanel>
      <TabPanel>
        <div className="grid grid-cols-1 gap-4">
          {textualResources.map((textualResource, index) => {
            return (
              <div className="flex items-end" key={index}>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-gray-700">Label (required)</span>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                      value={textualResource.label}
                      placeholder="Label"
                      onChange={(event) => {
                        handleTextualResourceFormChange(event, index)
                      }}
                      id="label"
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Value (optional)</span>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                      value={textualResource.value}
                      placeholder="Value"
                      onChange={(event) => {
                        handleTextualResourceFormChange(event, index)
                      }}
                      id="value"
                    />
                  </label>
                </div>
                <button
                  className="text-gray-700"
                  onClick={() => {
                    removeTextualResource(index)
                  }}
                >
                  &#x2715; Delete
                </button>
              </div>
            )
          })}
          <button
            type="button"
            onClick={() => {
              addEmptyTextualResource()
            }}
            className="bg-transparent hover:bg-gray-50 text-gray-500 border border-gray-500 rounded w-8 h-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </TabPanel>
      <TabPanel>
        <label className="block">
          <span className="text-gray-700">Assigned user</span>
          <select
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
            value={userResource.username}
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
  )
}

export default ItemResourcesForm

import React, { useEffect, useState } from 'react'
import {
  NumericResource,
  TemporalResource,
  TextualResource,
  UpdateWorkflowListEntity,
  User,
  UserResource,
  WorkflowList,
  WorkflowListResource,
} from 'utils/models'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { compareDateOptions, formatDuration } from 'utils/date-util'
import { getOptionalNumber, getOptionalString } from 'utils/optional-util'
import timeDurationsInMinutes from 'utils/globals'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { arraysEqual } from 'utils/compare-util'
import CalendarIcon, {
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  FlagIcon,
  UserIcon,
} from 'components/icons'
import { getUsers } from 'utils/workflow-api'

interface ModifyItemModalProps {
  show
  closeModal
  workflowList: WorkflowList
  isInsideTemporalConstraintBoard: boolean
  modifyWorkflowList
  modifyResources
}

const ModifyItemModal = ({
  show,
  closeModal,
  workflowList,
  isInsideTemporalConstraintBoard,
  modifyWorkflowList,
  modifyResources,
}: ModifyItemModalProps): JSX.Element => {
  // STATE
  const initUpdateItemEntity: UpdateWorkflowListEntity = {
    newTitle: workflowList.title,
    newDescription: getOptionalString(workflowList.description),
    isTemporalConstraintBoard: workflowList.isTemporalConstraintBoard,
  }
  const initTempResource: TemporalResource = workflowList.temporalResource
    ? {
        startDate: workflowList.temporalResource.startDate,
        endDate: workflowList.temporalResource.endDate,
        durationInMinutes: getOptionalNumber(workflowList.temporalResource.durationInMinutes),
      }
    : {
        startDate: null,
        endDate: null,
        durationInMinutes: 0,
      }
  const initNumericResources = workflowList.numericResources
  const initTextualResources = workflowList.textualResources
  const initUserResource = workflowList.userResource
    ? {
        username: getOptionalString(workflowList.userResource.username),
      }
    : {
        username: '',
      }
  const initUsers: Array<User> = []

  const [updateItemEntity, setUpdateItemEntity] = useState(initUpdateItemEntity)
  const [tempResource, setTempResource] = useState(initTempResource)
  const [numericResources, setNumericResources] = useState(initNumericResources)
  const [textualResources, setTextualResources] = useState(initTextualResources)
  const [userResource, setUserResource] = useState(initUserResource)
  const [users, setUsers] = useState(initUsers)

  useEffect(() => {
    init()
  }, [])

  const init = () => {
    getUsers().then((users) => {
      if (users) {
        setUsers(users)
      }
    })
  }

  // DYNAMIC CLASSES
  const showHideClass = show ? '' : 'hidden'

  // FUNCTIONS
  const handleUpdateItemFormChange = (event) => {
    const newState = { ...updateItemEntity, [event.target.id]: event.target.value }
    setUpdateItemEntity(newState)
  }

  const handleDatePickerChange = (date, key) => {
    const newState = { ...tempResource, [key]: date }
    setTempResource(newState)
  }

  const handleTimeRequiredSelectionChange = (event) => {
    if (event.target.value === 0) {
      const newState = { ...tempResource, durationInMinutes: 0 }
      setTempResource(newState)
    } else {
      const newState = { ...tempResource, durationInMinutes: parseInt(event.target.value) }
      setTempResource(newState)
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

  const isWorkflowListUnchanged = (): boolean => {
    return (
      updateItemEntity.newTitle == initUpdateItemEntity.newTitle &&
      updateItemEntity.newDescription == initUpdateItemEntity.newDescription
    )
  }

  const isTemporalResourceUnchanged = (): boolean => {
    return (
      compareDateOptions(tempResource.startDate, initTempResource.startDate) &&
      compareDateOptions(tempResource.endDate, initTempResource.endDate) &&
      tempResource.durationInMinutes == getOptionalNumber(initTempResource.durationInMinutes)
    )
  }

  const areNumericResourcesUnchanged = (): boolean => {
    return arraysEqual(numericResources, initNumericResources)
  }

  const areTextualResourcesUnchanged = (): boolean => {
    return arraysEqual(textualResources, initTextualResources)
  }

  const isUserResourceUnchanged = (): boolean => {
    return userResource.username === initUserResource.username
  }

  const isNumericResourceFormInvalid = (): boolean => {
    // @ts-ignore
    return numericResources.filter((nr) => nr.label === '' || nr.value === '').length !== 0
  }

  const isTextualResourceFormInvalid = (): boolean => {
    // @ts-ignore
    return textualResources.filter((tr) => tr.label === '').length !== 0
  }

  return (
    <div className={showHideClass}>
      {/* https://tailwindcomponents.com/component/modal-1 */}
      <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-gray-500 bg-opacity-75">
        <div className="bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* This div is taken from https://tailwindcss-forms.vercel.app/ simple --> */}
          <form>
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
                      onChange={handleUpdateItemFormChange}
                      id="newTitle"
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Description</span>
                    <textarea
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                      rows={3}
                      value={updateItemEntity.newDescription}
                      onChange={handleUpdateItemFormChange}
                      id="newDescription"
                    />
                  </label>
                  <span className="text-gray-700">Resources</span>
                  <Tabs>
                    <TabList>
                      {isInsideTemporalConstraintBoard && (
                        <Tab>
                          <div className="inline-flex items-center">
                            <div className="w-4 h-4 mr-1">
                              <ClockIcon />
                            </div>
                            Temporal
                          </div>
                        </Tab>
                      )}
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
                    {isInsideTemporalConstraintBoard && (
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
                                selected={tempResource ? tempResource.startDate : null}
                                onChange={(date) => handleDatePickerChange(date, 'startDate')}
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
                                selected={tempResource ? tempResource.endDate : null}
                                onChange={(date) => handleDatePickerChange(date, 'endDate')}
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
                              <div className="inline-flex items-center">
                                <div className="w-4 h-4 mr-1">
                                  <ClockIcon />
                                </div>
                                <span className="text-gray-700">Estimated time required</span>
                              </div>
                              <select
                                className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                value={tempResource.durationInMinutes}
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
                    )}
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
                          {users.map((user) => (
                            <option key={user.username} value={user.username}>
                              {user.username}
                            </option>
                          ))}
                        </select>
                      </label>
                    </TabPanel>
                  </Tabs>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
              <button
                type="button"
                disabled={
                  (isWorkflowListUnchanged() &&
                    isTemporalResourceUnchanged() &&
                    areNumericResourcesUnchanged() &&
                    areTextualResourcesUnchanged() &&
                    isUserResourceUnchanged()) ||
                  isNumericResourceFormInvalid() ||
                  isTextualResourceFormInvalid()
                }
                onClick={() => {
                  let numericEntity: Array<NumericResource> = null
                  let textualEntity: Array<TextualResource> = null
                  let temporalEntity: TemporalResource = null
                  let userEntity: UserResource = null
                  if (!isWorkflowListUnchanged()) {
                    modifyWorkflowList(workflowList.apiId, updateItemEntity).then((res) => {
                      closeModal()
                    })
                  }
                  if (!isTemporalResourceUnchanged()) {
                    // @ts-ignore
                    temporalEntity = {
                      ...tempResource,
                      durationInMinutes:
                        tempResource.durationInMinutes === 0
                          ? null
                          : tempResource.durationInMinutes,
                    }
                  }
                  if (!areNumericResourcesUnchanged() && !isNumericResourceFormInvalid()) {
                    numericEntity = numericResources
                  }
                  if (!areTextualResourcesUnchanged() && !isTextualResourceFormInvalid()) {
                    textualEntity = textualResources
                  }
                  if (!isUserResourceUnchanged()) {
                    if (userResource.username === '') {
                      userEntity = {
                        username: null,
                      }
                    } else {
                      userEntity = userResource
                    }
                  }
                  const entity: WorkflowListResource = {
                    numeric: numericEntity,
                    textual: textualEntity,
                    temporal: temporalEntity,
                    user: userEntity,
                  }
                  modifyResources(workflowList.apiId, entity).then((res) => {
                    closeModal()
                  })
                }}
                className="disabled:opacity-50 disabled:cursor-not-allowed w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  closeModal()
                  setUpdateItemEntity(initUpdateItemEntity)
                  setTempResource(initTempResource)
                  setNumericResources(initNumericResources)
                  setTextualResources(initTextualResources)
                }}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModifyItemModal

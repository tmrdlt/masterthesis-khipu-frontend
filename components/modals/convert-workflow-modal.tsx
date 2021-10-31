import React from 'react'
import { WorkflowList, WorkflowListType } from 'utils/models'

interface ConvertWorkflowListModalProps {
  workflowList: WorkflowList
  convertWorkflowList
  setShowConvertModal
}

const ConvertWorkflowListModal = ({
                                      workflowList,
                                      convertWorkflowList,
                                      setShowConvertModal,
                                  }: ConvertWorkflowListModalProps): JSX.Element => {
    return (
        <div>
            {/* https://tailwindcomponents.com/component/modal-1 */}
            <div
                className="h-screen w-full fixed left-0 top-0 flex justify-center items-start bg-gray-500 bg-opacity-75">
                <div className="bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    {/* This div is taken from https://tailwindcss-forms.vercel.app/ simple --> */}
                    <div className="m-5">
                        <h3 className="font-bold">
                            Are you sure you want to convert
                            the {workflowList.usageType.toLowerCase()} &quot;{workflowList.title}&quot; to
                            an {WorkflowListType.ITEM.toLowerCase()}? You might loose information as only direct
                            sub-elements will be preserved.
                        </h3>
                    </div>
                    <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                        <button
                            type="button"
                            onClick={() => {
                                convertWorkflowList()
                                setShowConvertModal(false)
                            }}
                            className="disabled:opacity-50 disabled:cursor-not-allowed w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Convert
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowConvertModal(false)
                            }}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConvertWorkflowListModal

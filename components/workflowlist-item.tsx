import { Draggable } from 'react-beautiful-dnd'
import React, { useEffect, useState } from 'react'
import { WorkflowList } from 'utils/models'
import MoveWorkflowListModal, {
  MoveWorkflowListCoverElement,
} from 'components/modals/move-workflowlist-modal'
import ButtonsMenu from 'components/buttons-menu'
import { formatDate, formatDuration } from 'utils/date-util'
import ModifyItemModal from 'components/modals/modify-item-modal'
import { hasNoTemporalResource, hasNoUserResource } from 'utils/resource-util'
import CalendarIcon, {
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  FlagIcon,
  UserIcon,
} from 'components/icons'
import 'react-popper-tooltip/dist/styles.css'
import { ItemTemporalQueryResult } from 'components/temporal-query-results'
import { getBorderClassItem, getMoveClass } from 'utils/style-elements'

interface WorkflowlistItemProps {
  index: number
  workflowList: WorkflowList
  userApiId: string
  workflowListToMove: WorkflowList
  marginClass: string
  selectWorkflowListToMove
}

const WorkflowlistItem = ({
  index,
  workflowList,
  userApiId,
  workflowListToMove,
  marginClass,
  selectWorkflowListToMove,
}: WorkflowlistItemProps): JSX.Element => {
  // STATE
  const [showModifyModal, setShowModifyModal] = useState(false)
  const [showMoveModal, setShowMoveModal] = useState(false)

  useEffect(() => {
    if (!workflowListToMove) {
      closeMoveModal()
    }
  }, [workflowListToMove])

  // FUNCTIONS
  const openModifyModal = () => {
    setShowModifyModal(true)
  }
  const closeModifyModal = () => {
    setShowModifyModal(false)
  }
  const openMoveModal = () => {
    setShowMoveModal(true)
  }
  const closeMoveModal = () => {
    setShowMoveModal(false)
  }

  const getTemporalResourceText = (): JSX.Element => {
    let elements: Array<JSX.Element> = []
    if (!hasNoTemporalResource(workflowList.temporalResource)) {
      const temp = workflowList.temporalResource
      if (temp.startDate) {
        elements.push(
          <div key={0} className="flex flex-nowrap items-center">
            <div className="w-3 h-3 mr-1">
              <CalendarIcon />
            </div>
            <div className="flex-none">Start date: {formatDate(temp.startDate)}</div>
          </div>
        )
      }
      if (temp.endDate) {
        elements.push(
          <div key={1} className="flex flex-nowrap items-center">
            <div className="w-3 h-3 mr-1">
              <FlagIcon />
            </div>
            <div className="flex-none">Due date: {formatDate(temp.endDate)}</div>
          </div>
        )
      }
      if (temp.durationInMinutes) {
        elements.push(
          <div key={2} className="flex flex-nowrap items-center">
            <div className="w-3 h-3 mr-1">
              <ClockIcon />
            </div>
            <div className="flex-none">Takes {formatDuration(temp.durationInMinutes)}</div>
          </div>
        )
        elements.push()
      }
    }
    return (
      <div className="text-xs">
        {!hasNoTemporalResource(workflowList.temporalResource) &&
          elements.map((element) => {
            return element
          })}
      </div>
    )
  }

  const getNumericResourcesText = (): JSX.Element => {
    return (
      <div className="text-xs">
        {workflowList.numericResources.map((numericResource, index) => {
          return (
            <div key={index} className="flex flex-nowrap items-center">
              <div className="w-3 h-3 mr-1">
                <ChartBarIcon />
              </div>
              <span className="flex-none">{'' + numericResource.label}:&nbsp;</span>
              <span className="flex-none">{numericResource.value}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const getTextualResourcesText = (): JSX.Element => {
    return (
      <div className="text-xs">
        {workflowList.textualResources.map((textualResource, index) => {
          return (
            <div key={index} className="flex flex-nowrap items-center">
              <div className="w-3 h-3 mr-1">
                <DocumentTextIcon />
              </div>
              <span className="flex-none">{textualResource.label}</span>
              <span className="flex-none">
                {textualResource.value ? ': ' + textualResource.value : ''}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  const getUserResourceText = (): JSX.Element => {
    return (
      <div className="grid text-xs">
        {!hasNoUserResource(workflowList.userResource) && (
          <div key={index} className="inline-flex items-center">
            <div className="w-3 h-3 mr-1">
              <UserIcon />
            </div>
            <span>{workflowList.userResource.username}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <Draggable key={workflowList.apiId} draggableId={workflowList.apiId} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} className={`${marginClass}`}>
          {showMoveModal && <MoveWorkflowListCoverElement />}
          <>
            <div className="flex shadow-md max-w-max">
              <div
                className={`bg-blueGray-100 h-5 w-20 rounded-t flex items-center tracking-wide pl-3 text-xs text-gray-700 ${getMoveClass(
                  showMoveModal
                )}`}
                {...provided.dragHandleProps}
              >
                Item
              </div>
              {workflowList.temporalQueryResult != null && (
                <ItemTemporalQueryResult temporalQueryResult={workflowList.temporalQueryResult} />
              )}
            </div>
            <div
              className={`bg-white ${getBorderClassItem(
                workflowList.level
              )} shadow-md shadow min-w-[20rem] max-w-[20rem] p-1 ${getMoveClass(showMoveModal)}`}
            >
              <div className="flex place-content-between">
                <div className={`flex flex-col m-1 rounded pl-1`}>
                  <div className="text-sm font-medium overflow-ellipsis overflow-hidden">
                    {workflowList.title}
                  </div>
                  {getTemporalResourceText()}
                  {getNumericResourcesText()}
                  {getTextualResourcesText()}
                  {getUserResourceText()}
                </div>
                <div className="flex flex-col items-center">
                  <ButtonsMenu
                    userApiId={userApiId}
                    workflowList={workflowList}
                    selectWorkflowListToMove={selectWorkflowListToMove}
                    openModifyModal={openModifyModal}
                    openMoveModal={openMoveModal}
                  />
                </div>
              </div>
              {workflowList.description !== null && (
                <div className="text-sm whitespace-pre-line break-words mr-2 ml-2 mb-2">
                  {workflowList.description}
                </div>
              )}
            </div>
            {showModifyModal && (
              <ModifyItemModal
                userApiId={userApiId}
                workflowList={workflowList}
                closeModal={closeModifyModal}
              />
            )}
            {showMoveModal && (
              <MoveWorkflowListModal
                closeModal={closeMoveModal}
                selectWorkflowListToMove={selectWorkflowListToMove}
              />
            )}
          </>
        </div>
      )}
    </Draggable>
  )
}

export default WorkflowlistItem

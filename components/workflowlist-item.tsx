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
          <span key={0} className="flex items-center">
            <span className="w-3 h-3 mr-1">
              <CalendarIcon />
            </span>
            Start date: {formatDate(temp.startDate)}
          </span>
        )
      }
      if (temp.dueDate) {
        elements.push(
          <span key={1} className="flex items-center">
            <span className="w-3 h-3 mr-1">
              <FlagIcon />
            </span>
            <span className="flex-none">Due date: {formatDate(temp.dueDate)}</span>
          </span>
        )
      }
      if (temp.durationInMinutes) {
        elements.push(
          <span key={2} className="flex items-center">
            <span className="w-3 h-3 mr-1">
              <ClockIcon />
            </span>
            Takes {formatDuration(temp.durationInMinutes)}
          </span>
        )
        elements.push()
      }
    }
    return (
      <>
        {elements.map((element) => {
          return element
        })}
      </>
    )
  }

  const getNumericResourcesText = (): JSX.Element => {
    return (
      <>
        {workflowList.numericResources.map((numericResource, index) => {
          return (
            <span key={index} className="flex items-center">
              <span className="w-3 h-3 mr-1">
                <ChartBarIcon />
              </span>
              {'' + numericResource.label}:&nbsp;
              {numericResource.value}
            </span>
          )
        })}
      </>
    )
  }

  const getTextualResourcesText = (): JSX.Element => {
    return (
      <>
        {workflowList.textualResources.map((textualResource, index) => {
          return (
            <span key={index} className="flex items-centers">
              <span className="w-3 h-3 mr-1">
                <DocumentTextIcon />
              </span>
              {textualResource.label}
              {textualResource.value ? ': ' + textualResource.value : ''}
            </span>
          )
        })}
      </>
    )
  }

  const getUserResourceText = (): JSX.Element => {
    return (
      <>
        {!hasNoUserResource(workflowList.userResource) && (
          <span key={index} className="flex items-center">
            <span className="w-3 h-3 mr-1">
              <UserIcon />
            </span>
            <span>{workflowList.userResource.username}</span>
          </span>
        )}
      </>
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
              )} shadow-md shadow min-w-[20rem] max-w-[20rem] p-1 pb-2 ${getMoveClass(
                showMoveModal
              )}`}
            >
              <div className="flex place-content-between">
                <div className="mt-1 ml-1 mr-1 pl-1 text-sm leading-tight font-medium overflow-ellipsis overflow-hidden">
                  {workflowList.title}
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
              <div className="text-xs ml-1 pl-1">
                  {getTemporalResourceText()}
                  {getNumericResourcesText()}
                  {getTextualResourcesText()}
                  {getUserResourceText()}
              </div>
              {workflowList.description !== null && (
                <div className="text-sm whitespace-pre-line break-words mt-1 mr-2 ml-2">
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

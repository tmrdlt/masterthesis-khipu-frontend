import { Draggable } from 'react-beautiful-dnd'
import React, { useEffect, useState } from 'react'
import { WorkflowList } from 'utils/models'
import MoveWorkflowListModal from 'components/modals/move-workflowlist-modal'
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
import { getNumberWithOrdinal } from 'utils/number-util'
import 'react-popper-tooltip/dist/styles.css'
import { usePopperTooltip } from 'react-popper-tooltip'

interface IItemProps {
  index: number
  workflowList: WorkflowList
  userApiId: string
  isInsideTemporalConstraintBoard: boolean
  workflowListToMove: WorkflowList
  selectWorkflowListToMove
}

const ItemComponent = ({
  index,
  workflowList,
  userApiId,
  isInsideTemporalConstraintBoard,
  workflowListToMove,
  selectWorkflowListToMove,
}: IItemProps): JSX.Element => {
  // STATE
  const [showModifyModal, setShowModifyModal] = useState(false)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip()

  useEffect(() => {
    if (!workflowListToMove) {
      closeMoveModal()
    }
  }, [workflowListToMove])

  // DYNAMIC CLASSES
  const moveClassName = showMoveModal ? ' z-20 relative transition-all' : ''
  const temporalQueryLabelColor =
    workflowList.temporalQueryResult != null
      ? workflowList.temporalQueryResult.dueDateKept
        ? ' bg-green-500'
        : ' bg-red-500'
      : ''

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
          <div key={0} className="inline-flex items-center">
            <div className="w-3 h-3 mr-1">
              <CalendarIcon />
            </div>
            {'Start date: ' + formatDate(temp.startDate)}
          </div>
        )
      }
      if (temp.endDate) {
        elements.push(
          <div key={1} className="inline-flex items-center">
            <div className="w-3 h-3 mr-1">
              <FlagIcon />
            </div>
            {'Due date: ' + formatDate(temp.endDate)}
          </div>
        )
      }
      if (temp.durationInMinutes) {
        elements.push(
          <div key={2} className="inline-flex items-center">
            <div className="w-3 h-3 mr-1">
              <ClockIcon />
            </div>
            {'Takes ' + formatDuration(temp.durationInMinutes)}
          </div>
        )
        elements.push()
      }
    }
    return (
      <div className="grid text-xs">
        {!hasNoTemporalResource(workflowList.temporalResource) &&
          elements.map((element) => {
            return element
          })}
      </div>
    )
  }

  const getNumericResourcesText = (): JSX.Element => {
    return (
      <div className="grid text-xs">
        {workflowList.numericResources.map((numericResource, index) => {
          return (
            <div key={index} className="inline-flex items-center">
              <div className="w-3 h-3 mr-1">
                <ChartBarIcon />
              </div>
              <span>{'' + numericResource.label}:&nbsp;</span>
              <span>{numericResource.value}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const getTextualResourcesText = (): JSX.Element => {
    return (
      <div className="grid text-xs">
        {workflowList.textualResources.map((textualResource, index) => {
          return (
            <div key={index} className="inline-flex items-center">
              <div className="w-3 h-3 mr-1">
                <DocumentTextIcon />
              </div>
              <span>{textualResource.label}</span>
              <span>{textualResource.value ? ': ' + textualResource.value : ''}</span>
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
      {(provided, _snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} className="mb-2 mr-2">
          <div
            className={
              'bg-white border border-gray-500 rounded shadow max-w-sm p-1' + moveClassName
            }
          >
            <div className="flex place-content-between">
              <div className="grid w-full m-1 hover:bg-gray-200" {...provided.dragHandleProps}>
                <span className="font-bold">{workflowList.title} </span>
                {isInsideTemporalConstraintBoard && getTemporalResourceText()}
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
                {workflowList.temporalQueryResult != null && (
                  <div>
                    <div
                      className={
                        'flex w-10 border border-gray-500 rounded p-1 text-xs justify-center items-center' +
                        temporalQueryLabelColor
                      }
                      ref={setTriggerRef}
                    >
                      {getNumberWithOrdinal(workflowList.temporalQueryResult.index + 1)}
                    </div>
                    {visible && (
                      <div
                        ref={setTooltipRef}
                        {...getTooltipProps({ className: 'tooltip-container text-xs' })}
                      >
                        <span>
                          Optimal processing order:{' '}
                          {getNumberWithOrdinal(workflowList.temporalQueryResult.index + 1)}
                        </span>
                        <span>
                          Calculated start date:{' '}
                          {formatDate(workflowList.temporalQueryResult.startedAt)}
                        </span>
                        <span>
                          Calculated finish date:{' '}
                          {formatDate(workflowList.temporalQueryResult.finishedAt)}
                        </span>
                        <span>
                          Calculated remaining duration:{' '}
                          {formatDuration(workflowList.temporalQueryResult.duration)}
                        </span>
                        {workflowList.temporalQueryResult.dueDate != null && (
                          <span>
                            Does {workflowList.temporalQueryResult.dueDateKept ? '' : 'NOT '}comply
                            with due date
                          </span>
                        )}
                        <div {...getArrowProps({ className: 'tooltip-arrow' })} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="m-1 text-sm whitespace-pre bg-gray-100 rounded p-1">
              {workflowList.description}
            </div>
          </div>
          {showModifyModal && (
            <ModifyItemModal
              userApiId={userApiId}
              workflowList={workflowList}
              isInsideTemporalConstraintBoard={isInsideTemporalConstraintBoard}
              closeModal={closeModifyModal}
            />
          )}
          {showMoveModal && (
            <MoveWorkflowListModal
              closeModal={closeMoveModal}
              selectWorkflowListToMove={selectWorkflowListToMove}
            />
          )}
        </div>
      )}
    </Draggable>
  )
}

export default ItemComponent

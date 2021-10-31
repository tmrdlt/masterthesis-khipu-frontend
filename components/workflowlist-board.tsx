import { WorkflowList, WorkflowListType } from 'utils/models'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import WorkflowlistList from 'components/workflowlist-list'
import React, { useEffect, useState } from 'react'
import CreateWorkflowListModal from 'components/modals/create-workflowlist-modal'
import WorkflowlistItem from 'components/workflowlist-item'
import {
  getBorderClassBoard,
  getDroppableStyle,
  getMargin,
  getMoveClass,
} from 'utils/style-elements'
import MoveWorkflowListModal, {
  MoveWorkflowListCoverElement,
} from 'components/modals/move-workflowlist-modal'
import DropButton from 'components/buttons/drop-button'
import ButtonsMenu from 'components/buttons-menu'
import { formatDate } from 'utils/date-util'
import ModifyBoardModal from 'components/modals/modify-board-modal'
import { FlagIcon } from 'components/icons'
import BoardTemporalQueryResult, {
  ListTemporalQueryResult,
} from 'components/temporal-query-results'
import { getLowerWorkflowListType } from 'utils/models-util'

interface WorkflowListBoardProps {
  index: number
  workflowList: WorkflowList
  userApiId: string
  workflowListToMove: WorkflowList
  marginClass: string
  moveWorkflowList
  selectWorkflowListToMove
  showDropButton
  getTemporalQueryResult
}

const WorkflowlistBoard = ({
  index,
  workflowList,
  userApiId,
  workflowListToMove,
  marginClass,
  moveWorkflowList,
  selectWorkflowListToMove,
  showDropButton,
  getTemporalQueryResult,
}: WorkflowListBoardProps): JSX.Element => {
  // STATE
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showModifyModal, setShowModifyModal] = useState(false)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [isLoadingQuery, setIsLoadingQuery] = useState(false)

  useEffect(() => {
    if (!workflowListToMove) {
      closeMoveModal()
    }
  }, [workflowListToMove])

  useEffect(() => {
    if (workflowList.boardTemporalQueryResult != null || workflowList.temporalQueryError != null) {
      setIsLoadingQuery(false)
    }
  }, [workflowList.boardTemporalQueryResult, workflowList.temporalQueryError])

  // FUNCTIONS
  const openCreateModal = () => {
    setShowCreateModal(true)
  }
  const closeCreateModal = () => {
    setShowCreateModal(false)
  }
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
  const startLoading = () => {
    setIsLoadingQuery(true)
  }

  const getTemporalResourceText = (): string => {
    return workflowList.temporalResource && workflowList.temporalResource.endDate
      ? 'Board due on: ' + formatDate(workflowList.temporalResource.endDate)
      : 'No due date configured'
  }

  return (
    <Draggable key={workflowList.apiId} draggableId={workflowList.apiId} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} className={`${marginClass}`}>
          {showMoveModal && <MoveWorkflowListCoverElement />}
          <>
            <div
              className={
                `bg-blue-300 h-5 w-20 shadow-md rounded-t flex items-center tracking-wide pl-4 text-sm text-gray-700 ${getMoveClass(showMoveModal)}`
              }
              {...provided.dragHandleProps}
            >
              Board
            </div>
            <div
              className={`shadow-md ${getBorderClassBoard(
                workflowList.level
              )} bg-blue-200 p-1 min-w-[18rem] min-h-[8rem] ${getMoveClass(showMoveModal)}`}
            >
              <div className="flex place-content-between">
                <div
                  className={`grid w-full m-1 pl-2`}
                >
                  <span className="font-bold">{workflowList.title} </span>
                  {workflowList.isTemporalConstraintBoard && (
                    <div className="inline-flex items-center text-xs">
                      <div className="w-3 h-3 mr-1">
                        <FlagIcon />
                      </div>
                      {getTemporalResourceText()}
                    </div>
                  )}
                </div>
                <div className="flex flex-row">
                  {workflowList.boardTemporalQueryResult != null &&
                    workflowList.workSchedule != null && (
                      <BoardTemporalQueryResult
                        temporalQueryResult={workflowList.boardTemporalQueryResult}
                        workSchedule={workflowList.workSchedule}
                      />
                    )}
                  <ButtonsMenu
                    userApiId={userApiId}
                    workflowList={workflowList}
                    selectWorkflowListToMove={selectWorkflowListToMove}
                    openCreateModal={openCreateModal}
                    openModifyModal={openModifyModal}
                    openMoveModal={openMoveModal}
                    getTemporalQueryResult={getTemporalQueryResult}
                    isLoadingQuery={isLoadingQuery}
                    startLoading={startLoading}
                  />
                </div>
              </div>

              <div className="flex place-content-between">
                <div className="m-1 text-sm whitespace-pre pl-2">{workflowList.description}</div>
                {workflowList.temporalQueryResult != null && (
                  <ListTemporalQueryResult temporalQueryResult={workflowList.temporalQueryResult} />
                )}
                {showDropButton(workflowList) && (
                  <div className="mr-1">
                    <DropButton workflowList={workflowList} moveWorkflowList={moveWorkflowList} />
                  </div>
                )}
              </div>
              <Droppable
                droppableId={workflowList.apiId}
                direction="horizontal"
                type={workflowList.level}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-1 ${getDroppableStyle(snapshot.isDraggingOver)}`}
                  >
                    <div className="flex justify-start overflow-x-scroll p-2">
                      {workflowList.children.map((wl, index) => {
                        if (wl.usageType == WorkflowListType.BOARD) {
                          return (
                            <WorkflowlistBoard
                              key={index}
                              index={index}
                              workflowList={wl}
                              userApiId={userApiId}
                              workflowListToMove={workflowListToMove}
                              marginClass={getMargin(workflowList.usageType)}
                              moveWorkflowList={moveWorkflowList}
                              selectWorkflowListToMove={selectWorkflowListToMove}
                              showDropButton={showDropButton}
                              getTemporalQueryResult={getTemporalQueryResult}
                            />
                          )
                        } else if (wl.usageType == WorkflowListType.LIST) {
                          return (
                            <WorkflowlistList
                              key={index}
                              index={index}
                              workflowList={wl}
                              userApiId={userApiId}
                              workflowListToMove={workflowListToMove}
                              marginClass={getMargin(workflowList.usageType)}
                              moveWorkflowList={moveWorkflowList}
                              selectWorkflowListToMove={selectWorkflowListToMove}
                              showDropButton={showDropButton}
                              getTemporalQueryResult={getTemporalQueryResult}
                            />
                          )
                        } else {
                          return (
                            <WorkflowlistItem
                              key={index}
                              index={index}
                              workflowList={wl}
                              userApiId={userApiId}
                              workflowListToMove={workflowListToMove}
                              marginClass={getMargin(workflowList.usageType)}
                              selectWorkflowListToMove={selectWorkflowListToMove}
                            />
                          )
                        }
                      })}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
            {showCreateModal && (
              <CreateWorkflowListModal
                closeModal={closeCreateModal}
                defaultCreateType={getLowerWorkflowListType(workflowList.usageType)}
                parentUuid={workflowList.apiId}
                userApiId={userApiId}
              />
            )}
            {showModifyModal && (
              <ModifyBoardModal
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

export default WorkflowlistBoard

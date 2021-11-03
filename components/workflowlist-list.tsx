import { Draggable, Droppable } from 'react-beautiful-dnd'
import React, { useEffect, useState } from 'react'
import { WorkflowList, WorkflowListType } from 'utils/models'
import WorkflowlistItem from 'components/workflowlist-item'
import CreateWorkflowListModal from 'components/modals/create-workflowlist-modal'
import ModifyListModal from 'components/modals/modify-list-modal'
import WorkflowlistBoard from 'components/workflowlist-board'
import {
  getBorderClassList,
  getDroppableStyle,
  getMargin,
  getMoveClass,
} from 'utils/style-elements'
import MoveWorkflowListModal, {
  MoveWorkflowListCoverElement,
} from 'components/modals/move-workflowlist-modal'
import DropButton from 'components/buttons/drop-button'
import ButtonsMenu from 'components/buttons-menu'
import { ListTemporalQueryResult } from 'components/temporal-query-results'
import { getLowerWorkflowListType } from 'utils/models-util'

interface WorkflowlistListProps {
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

const WorkflowlistList = ({
  index,
  workflowList,
  userApiId,
  workflowListToMove,
  marginClass,
  moveWorkflowList,
  selectWorkflowListToMove,
  showDropButton,
  getTemporalQueryResult,
}: WorkflowlistListProps): JSX.Element => {
  // STATE
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showModifyModal, setShowModifyModal] = useState(false)
  const [showMoveModal, setShowMoveModal] = useState(false)

  useEffect(() => {
    if (!workflowListToMove) {
      closeMoveModal()
    }
  }, [workflowListToMove])

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

  return (
    <Draggable key={workflowList.apiId} draggableId={workflowList.apiId} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} className={`${marginClass}`}>
          {showMoveModal && <MoveWorkflowListCoverElement />}
          <>
            <div className="flex shadow-md max-w-max">
              <div
                className={`bg-red-200 h-5 w-20 rounded-t flex items-center tracking-wide pl-4 text-xs text-gray-700 ${getMoveClass(
                  showMoveModal
                )}`}
                {...provided.dragHandleProps}
              >
                List
              </div>
              {workflowList.temporalQueryResult != null && (
                <ListTemporalQueryResult temporalQueryResult={workflowList.temporalQueryResult} />
              )}
            </div>
            <div
              className={`${getBorderClassList(
                workflowList.level
              )} bg-red-100 shadow-md p-1 ${getMoveClass(showMoveModal)}`}
            >
              <div className="flex place-content-between">
                <div
                  className={`text-sm font-medium overflow-ellipsis overflow-hidden mt-1 ml-2 mr-1`}
                >
                  {workflowList.title}
                </div>
                <ButtonsMenu
                  userApiId={userApiId}
                  workflowList={workflowList}
                  selectWorkflowListToMove={selectWorkflowListToMove}
                  openCreateModal={openCreateModal}
                  openModifyModal={openModifyModal}
                  openMoveModal={openMoveModal}
                />
              </div>
              {workflowList.description != null && (
                <div className="text-sm whitespace-pre-line break-words ml-2 mr-2">
                  {workflowList.description}
                </div>
              )}

              <Droppable droppableId={workflowList.apiId} type={workflowList.level}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex flex-col items-start p-2 min-w-[18rem] min-h-[5rem] ${getDroppableStyle(
                      snapshot.isDraggingOver
                    )}`}
                  >
                    {workflowList.children.map((wl, index) => {
                      if (wl.usageType == WorkflowListType.BOARD) {
                        return (
                          <WorkflowlistBoard
                            key={index}
                            index={index}
                            workflowList={wl}
                            userApiId={userApiId}
                            workflowListToMove={workflowListToMove}
                            marginClass={getMargin(workflowList.usageType, index, workflowList.children.length)}
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
                            marginClass={getMargin(workflowList.usageType, index, workflowList.children.length)}
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
                            marginClass={getMargin(workflowList.usageType, index, workflowList.children.length)}
                            userApiId={userApiId}
                            workflowListToMove={workflowListToMove}
                            selectWorkflowListToMove={selectWorkflowListToMove}
                          />
                        )
                      }
                    })}
                    {provided.placeholder}
                    {showDropButton(workflowList) && (
                      <DropButton workflowList={workflowList} moveWorkflowList={moveWorkflowList} />
                    )}
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
              <ModifyListModal
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

export default WorkflowlistList

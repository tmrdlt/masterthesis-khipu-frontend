import { Draggable, Droppable } from 'react-beautiful-dnd'
import React, { useEffect, useState } from 'react'
import { WorkflowList, WorkflowListType } from 'utils/models'
import WorkflowlistItem from 'components/workflowlist-item'
import CreateWorkflowListModal from 'components/modals/create-workflowlist-modal'
import ModifyListModal from 'components/modals/modify-list-modal'
import WorkflowlistBoard from 'components/workflowlist-board'
import { getDroppableStyle, getMargin } from 'utils/style-elements'
import MoveWorkflowListModal from 'components/modals/move-workflowlist-modal'
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

  // DYNAMIC CLASSES
  const moveClassName = showMoveModal ? 'z-20 relative transition-all' : ''

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
          {showMoveModal &&
          <div className="z-30 bg-transparent absolute w-full h-full"/>
          }
          <div
            className={`bg-red-300 border border-gray-500 rounded shadow min-w-[18rem] min-h-[8rem] p-1 ${moveClassName}`}
          >
            <div className="flex place-content-between">
              <div className="w-full font-bold m-1 hover:bg-red-200" {...provided.dragHandleProps}>
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

            <div className="flex place-content-between">
              <div className="m-1 text-sm whitespace-pre-line">{workflowList.description}</div>
              {workflowList.temporalQueryResult != null && (
                <ListTemporalQueryResult temporalQueryResult={workflowList.temporalQueryResult} />
              )}
              {showDropButton(workflowList) && (
                <div className="mr-1">
                  <DropButton workflowList={workflowList} moveWorkflowList={moveWorkflowList} />
                </div>
              )}
            </div>

            <Droppable droppableId={workflowList.apiId} type={workflowList.level}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getDroppableStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                  className="p-1"
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
                          marginClass={getMargin(workflowList.usageType)}
                          userApiId={userApiId}
                          workflowListToMove={workflowListToMove}
                          selectWorkflowListToMove={selectWorkflowListToMove}
                        />
                      )
                    }
                  })}
                  {provided.placeholder}
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
        </div>
      )}
    </Draggable>
  )
}

export default WorkflowlistList

import React, { useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { WorkflowList, WorkflowListType } from 'utils/models'
import WorkflowlistBoard from 'components/workflowlist-board'
import {
  isChildOfParent,
  isInsideParent,
  recursiveMove,
  recursiveReorder,
  recursiveSetField,
} from 'utils/list-util'
import {
  getTemporalQuery,
  getWorkflowListsUrl,
  postWorkflowListMove,
  postWorkflowListReorder,
} from 'utils/workflow-api'
import CreateWorkflowListModal from 'components/modals/create-workflowlist-modal'
import WorkflowlistList from 'components/workflowlist-list'
import WorkflowlistItem from 'components/workflowlist-item'
import { getDroppableStyle, getMargin } from 'utils/style-elements'
import DropButton from 'components/buttons/drop-button'
import { useSWRConfig } from 'swr'
import produce from 'immer'
import { useWorkflowLists } from 'utils/swr-util'
import { getLowerWorkflowListType } from 'utils/models-util'
import { KhipuIcon, PlusIcon } from 'components/icons'
import LoadingSpinner from 'components/loading-spinner'
import LoadingError from 'components/loading-error'
import Link from 'next/link'

interface HomeProps {
  userApiId: string
}

const Home = ({ userApiId }: HomeProps): JSX.Element => {
  // STATE
  const [showCreateModal, setShowCreateModal] = useState(false)
  const initWorkflowListToMove: WorkflowList | null = null
  const [workflowListToMove, setWorkflowListToMove] = useState(initWorkflowListToMove)
  const { mutate } = useSWRConfig()
  const { workflowLists, isLoading, isError } = useWorkflowLists(userApiId)

  // FUNCTIONS
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    console.log('OnDragEnd', result)

    // Do nothing if invalid drag
    if (!destination || draggableId === destination.droppableId) {
      return
    }

    const sourceDroppableId: string = source.droppableId
    const destinationDroppableId: string = destination.droppableId

    if (sourceDroppableId === destinationDroppableId) {
      // It's a REORDER action
      // Use immer produce to create REAL clone
      let newWorkflowLists = produce(workflowLists, (draft) => {
        recursiveReorder(draft, sourceDroppableId, source.index, destination.index)
      })
      // mutate cache first
      mutate(getWorkflowListsUrl(userApiId), newWorkflowLists, false)

      if (source.index != destination.index) {
        await postWorkflowListReorder(draggableId, { newPosition: destination.index }, userApiId)
        fetchWorkflowLists()
      }
    } else {
      // It's a MOVE action
      // Use immer produce to create REAL clone
      let newWorkflowLists = produce(workflowLists, (draft) => {
        recursiveMove(draft, source, destination)
      })
      // mutate cache first
      mutate(getWorkflowListsUrl(userApiId), newWorkflowLists, false)

      let newParentUuid = null
      if (!(destinationDroppableId === 'ROOT')) {
        newParentUuid = destinationDroppableId
      }
      await postWorkflowListMove(
        draggableId,
        {
          newParentApiId: newParentUuid,
          newPosition: destination.index,
        },
        userApiId
      )
      fetchWorkflowLists()
    }
  }

  const openModal = () => {
    setShowCreateModal(true)
  }
  const closeModal = () => {
    setShowCreateModal(false)
  }

  const selectWorkflowListToMove = (wl: WorkflowList) => {
    setWorkflowListToMove(wl)
  }

  const showDropButton = (destinationToDropOn?: WorkflowList) => {
    // Move modal is not open do not show drop button
    if (!workflowListToMove) {
      return false
    } else {
      // Move Modal is Open

      // The following would be illegal moves or moves that doesn't make sense
      // Destination is already the list the element is in
      const destinationIsSameLevelAsElementToMove = isChildOfParent({
        lists: workflowLists,
        potentialChild: workflowListToMove,
        parent: destinationToDropOn,
      })
      // The destination would be inside the element we want to move
      const destinationInsideElementToMove = isInsideParent({
        potentialChild: destinationToDropOn,
        parent: workflowListToMove,
      })
      // The destination would be exactly the element we want to move
      const destinationIsElementToMove =
        destinationToDropOn && destinationToDropOn.apiId == workflowListToMove.apiId

      // Show drop button only if all three are false
      return (
        !destinationIsSameLevelAsElementToMove &&
        !destinationInsideElementToMove &&
        !destinationIsElementToMove
      )
    }
  }

  const fetchWorkflowLists = () => {
    mutate(getWorkflowListsUrl(userApiId))
  }

  const moveWorkflowList = (destinationWorkflowList?: WorkflowList) => {
    let newParentUuid = null
    // We are not on root
    if (destinationWorkflowList) {
      newParentUuid = destinationWorkflowList.apiId
    }
    postWorkflowListMove(
      workflowListToMove.apiId,
      { newParentApiId: newParentUuid },
      userApiId
    ).then((_res) => {
      fetchWorkflowLists()
      setWorkflowListToMove(null)
    })
  }

  const getTemporalQueryResult = (workflowListApiId: string) => {
    getTemporalQuery(workflowListApiId, userApiId).then((res) => {
      if (res) {
        // Use immer produce to create REAL clone
        let newWorkflowLists = produce(workflowLists, (draft) => {
          res.tasksResult.forEach((taskPlanningSolution) => {
            recursiveSetField(
              draft,
              taskPlanningSolution.apiId,
              'temporalQueryResult',
              taskPlanningSolution
            )
          })
          recursiveSetField(draft, workflowListApiId, 'boardTemporalQueryResult', res.boardResult)
          recursiveSetField(draft, workflowListApiId, 'workSchedule', res.workSchedule)
        })
        // Mutate only local cache
        mutate(getWorkflowListsUrl(userApiId), newWorkflowLists, false)
      } else {
        let newWorkflowLists = produce(workflowLists, (draft) => {
          recursiveSetField(draft, workflowListApiId, 'temporalQueryError', 'error')
        })
        // Mutate only local cache
        mutate(getWorkflowListsUrl(userApiId), newWorkflowLists, false)
      }
    })
  }

  if (isLoading) return <LoadingSpinner />
  if (isError) return <LoadingError />
  return (
    <div className="min-h-screen bg-khipu-bg-2">
      <div className="flex justify-between items-center px-6 py-3 w-full bg-khipu-bg-3 text-white">
        <div className="flex items-center gap-5">
          <Link href={'/'}>
            <a className="flex items-center">
              <div className="h-8 w-8 mr-2">
                <KhipuIcon />
              </div>
              <span>khipu</span>
            </a>
          </Link>
        </div>
        <button
          type="button"
          onClick={() => {
            openModal()
          }}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span className="-ml-1 mr-2 h-5 w-5 text-gray-400">
            <PlusIcon aria-hidden="true" />
          </span>
          <span>New Element</span>
        </button>
      </div>
      <div className="p-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="ROOT" type="ROOT">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`p-1 flex flex-col items-start ${getDroppableStyle(snapshot.isDraggingOver)}`}
              >
                {workflowLists.map((wl, index) => {
                  if (wl.usageType == WorkflowListType.BOARD) {
                    return (
                      <WorkflowlistBoard
                        key={index}
                        index={index}
                        workflowList={wl}
                        userApiId={userApiId}
                        workflowListToMove={workflowListToMove}
                        marginClass={getMargin(WorkflowListType.ROOT, index, workflowLists.length)}
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
                        marginClass={getMargin(WorkflowListType.ROOT, index, workflowLists.length)}
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
                        marginClass={getMargin(WorkflowListType.ROOT, index, workflowLists.length)}
                        selectWorkflowListToMove={selectWorkflowListToMove}
                      />
                    )
                  }
                })}
                {provided.placeholder}
                {showDropButton(null) && <DropButton moveWorkflowList={moveWorkflowList} />}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {showCreateModal && (
          <CreateWorkflowListModal
            closeModal={closeModal}
            defaultCreateType={getLowerWorkflowListType(null)}
            parentUuid={null}
            userApiId={userApiId}
          />
        )}
      </div>
    </div>
  )
}


export default Home

import { TaskPlanningSolution } from 'utils/models'
import { formatDate, formatDuration } from 'utils/date-util'
import React from 'react'
import { usePopperTooltip } from 'react-popper-tooltip'
import { getNumberWithOrdinal } from 'utils/number-util'

interface IBoardTemporalTooltipProps {
  temporalQueryResult: TaskPlanningSolution
}

const BoardTemporalQueryResult = ({
  temporalQueryResult,
}: IBoardTemporalTooltipProps): JSX.Element => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip()

  const temporalQueryLabelColor = temporalQueryResult.dueDateKept ? 'bg-green-500' : 'bg-red-500'

  return (
    <div className="flex justify-center items-center h-8">
      <div
        className={`flex border border-gray-500 rounded w-48 h-6 text-xs justify-center items-center mr-1 ${temporalQueryLabelColor}`}
        ref={setTriggerRef}
      >
        Remaining duration: {formatDuration(temporalQueryResult.duration)}
      </div>
      {visible && (
        <div
          className="bg-blue-900 border border-gray-500 rounded shadow p-1 text-xs text-center"
          ref={setTooltipRef}
          {...getTooltipProps({ className: 'tooltip-container text-xs' })}
        >
          <span>Calculated start date: {formatDate(temporalQueryResult.startedAt)}</span>
          <span>Calculated finish date: {formatDate(temporalQueryResult.finishedAt)}</span>
          <span>
            Calculated total remaining duration: {formatDuration(temporalQueryResult.duration)}
          </span>
          {temporalQueryResult.dueDate != null && (
            <span>Does {temporalQueryResult.dueDateKept ? '' : 'NOT '}comply with due date</span>
          )}
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
        </div>
      )}
    </div>
  )
}

interface IListTemporalTooltipProps {
  temporalQueryResult: TaskPlanningSolution
}

const ListTemporalQueryResult = ({
  temporalQueryResult,
}: IListTemporalTooltipProps): JSX.Element => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip()

  const temporalQueryLabelColor = temporalQueryResult.dueDateKept ? 'bg-green-500' : 'bg-red-500'

  return (
    <div className="mr-1">
      <div
        className={`flex w-10 border border-gray-500 rounded p-1 text-xs justify-center items-center ${temporalQueryLabelColor}`}
        ref={setTriggerRef}
      >
        {getNumberWithOrdinal(temporalQueryResult.index + 1)}
      </div>
      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container text-xs' })}>
          <span>
            Optimal processing order: {getNumberWithOrdinal(temporalQueryResult.index + 1)}
          </span>
          <span>Calculated start date: {formatDate(temporalQueryResult.startedAt)}</span>
          <span>Calculated finish date: {formatDate(temporalQueryResult.finishedAt)}</span>
          <span>Calculated remaining duration: {formatDuration(temporalQueryResult.duration)}</span>
          {temporalQueryResult.dueDate != null && (
            <span>Does {temporalQueryResult.dueDateKept ? '' : 'NOT '}comply with at least one due date</span>
          )}
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
        </div>
      )}
    </div>
  )
}

interface IItemTemporalTooltipProps {
  temporalQueryResult: TaskPlanningSolution
}

const ItemTemporalQueryResult = ({
  temporalQueryResult,
}: IItemTemporalTooltipProps): JSX.Element => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip()

  const temporalQueryLabelColor = temporalQueryResult.dueDateKept ? 'bg-green-500' : 'bg-red-500'

  return (
    <div>
      <div
        className={`flex w-10 border border-gray-500 rounded p-1 text-xs justify-center items-center ${temporalQueryLabelColor}`}
        ref={setTriggerRef}
      >
        {getNumberWithOrdinal(temporalQueryResult.index + 1)}
      </div>
      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container text-xs' })}>
          <span>
            Optimal processing order: {getNumberWithOrdinal(temporalQueryResult.index + 1)}
          </span>
          <span>Calculated start date: {formatDate(temporalQueryResult.startedAt)}</span>
          <span>Calculated finish date: {formatDate(temporalQueryResult.finishedAt)}</span>
          <span>Calculated remaining duration: {formatDuration(temporalQueryResult.duration)}</span>
          {temporalQueryResult.dueDate != null && (
            <span>Does {temporalQueryResult.dueDateKept ? '' : 'NOT '}comply with due date</span>
          )}
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
        </div>
      )}
    </div>
  )
}
export default BoardTemporalQueryResult
export { ListTemporalQueryResult, ItemTemporalQueryResult }

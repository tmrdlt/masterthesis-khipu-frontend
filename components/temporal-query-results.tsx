import { TaskPlanningSolution, WorkSchedule } from 'utils/models'
import { formatDate, formatDuration } from 'utils/date-util'
import React from 'react'
import { usePopperTooltip } from 'react-popper-tooltip'
import { getNumberWithOrdinal } from 'utils/number-util'

interface IBoardTemporalTooltipProps {
  temporalQueryResult: TaskPlanningSolution
  workSchedule: WorkSchedule
}

const BoardTemporalQueryResult = ({
  temporalQueryResult,
  workSchedule,
}: IBoardTemporalTooltipProps): JSX.Element => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip()

  const temporalQueryLabelColor = temporalQueryResult.dueDateKept ? 'bg-green-500' : 'bg-red-500'

  return (
    <div className="flex justify-center items-center h-8">
      <div
        className={`flex rounded w-max h-6 text-xs justify-center items-center mr-1 pl-1 pr-1 ${temporalQueryLabelColor}`}
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
          <span>Result is based on the following work schedule:</span>
          <WorkScheduleTable workSchedule={workSchedule} />
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
        </div>
      )}
    </div>
  )
}

interface WorkScheduleProps {
  workSchedule: WorkSchedule
}

const WorkScheduleTable = ({ workSchedule }: WorkScheduleProps): JSX.Element => {
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return (
    <table className="table-fixes border-collapse border border-black">
      <thead>
        <tr>
          {weekDays.map((day, index) => {
            return (
              <th className="border border-black w-20" key={index}>
                {day}
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        <tr>
          {weekDays.map((day, index) => {
            if (workSchedule.workingDaysOfWeek.includes(day.toUpperCase())) {
              return (
                <td className="border border-black text-center" key={index}>
                  {workSchedule.startWorkAtHour}-{workSchedule.stopWorkAtHour}h
                </td>
              )
            } else {
              return (
                <td className="border border-black text-center" key={index}>
                  no work
                </td>
              )
            }
          })}
        </tr>
      </tbody>
    </table>
  )
}

interface IListTemporalTooltipProps {
  temporalQueryResult: TaskPlanningSolution
}

const ListTemporalQueryResult = ({
  temporalQueryResult,
}: IListTemporalTooltipProps): JSX.Element => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
      usePopperTooltip({placement: 'right'} )

  const temporalQueryLabelColor = temporalQueryResult.dueDateKept ? 'bg-green-500' : 'bg-red-500'

  return (
    <>
      <div
        className={`flex w-10 h-5 rounded-t p-1 text-xs justify-center items-center ${temporalQueryLabelColor}`}
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
          <span>
            Calculated total remaining duration: {formatDuration(temporalQueryResult.duration)}
          </span>
          {temporalQueryResult.dueDate != null && (
            <span>
              {temporalQueryResult.dueDateKept
                ? 'Does comply with all due dates'
                : 'Does NOT comply with at least one due date'}
            </span>
          )}
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
        </div>
      )}
    </>
  )
}

interface IItemTemporalTooltipProps {
  temporalQueryResult: TaskPlanningSolution
}

const ItemTemporalQueryResult = ({
  temporalQueryResult,
}: IItemTemporalTooltipProps): JSX.Element => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
      usePopperTooltip({placement: 'right'} )

  const temporalQueryLabelColor = temporalQueryResult.dueDateKept ? 'bg-green-500' : 'bg-red-500'

  return (
    <>
      <div
        className={`flex w-10 h-5 rounded-t p-1 text-xs justify-center items-center ${temporalQueryLabelColor}`}
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
    </>
  )
}
export default BoardTemporalQueryResult
export { ListTemporalQueryResult, ItemTemporalQueryResult }

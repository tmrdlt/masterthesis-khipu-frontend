import { ChevronDownIcon, ChevronRightIcon } from 'components/icons'

interface TriggerProps {
  text: string
}

const Trigger = ({ text }: TriggerProps): JSX.Element => {
  return (
    <div className="text-gray-700 flex items-center justify-start gap-1">
      <span className="h-4 w-4">
        <ChevronRightIcon />
      </span>
      <span className="text-sm">{text}</span>
    </div>
  )
}

const TriggerWhenOpen = ({ text }: TriggerProps): JSX.Element => {
  return (
    <div className="text-gray-700 flex items-center justify-start gap-1">
      <span className="h-4 w-4">
        <ChevronDownIcon />
      </span>
      <span className="text-sm">{text}</span>
    </div>
  )
}

export default Trigger
export { TriggerWhenOpen }

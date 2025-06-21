import { useState } from 'react'
import { RiArrowRightSFill, RiArrowUpSFill } from 'react-icons/ri'
import './Dropdown.css'

interface DropdownOption<T> {
  name: string
  value: T
}

interface DropdownProps<T> {
  options: DropdownOption<T>[]
  select: (value: T) => void
  defaultOption: DropdownOption<T>
}

export const Dropdown = <T,>({ options, defaultOption, select }: DropdownProps<T>) => {
  const [expanded, setExpanded] = useState(false)
  const [selectedOption, setSelectedOption] = useState<DropdownOption<T>>(defaultOption)

  return (
    <div className="dropdown-container">
      <button className="selected-option" onClick={() => setExpanded(!expanded)}>
        {expanded ? <RiArrowUpSFill /> : <RiArrowRightSFill />}
        <span className="name">{selectedOption.name}</span>
      </button>
      <div className={`dropdown-options-container ${expanded ? '' : 'hidden'}`}>
        {Object.values(options).map((option) => (
          <button
            key={option.name}
            onClick={() => {
              select(option.value)
              setSelectedOption(option)
              setExpanded(false)
            }}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  )
}

import { KeyboardEvent, useRef } from 'react'
import '../assets/TextInput.css'

interface TextInputProps {
  value: string
  updateValue: (v: string) => void
  onEnter?: (v: string) => void
  placeholder?: string
}

export function TextInput({
  onEnter,
  value,
  updateValue,
  placeholder
}: TextInputProps): React.JSX.Element {
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (onEnter && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Prevents the default newline behavior
      onEnter(inputRef.current?.value ?? '')
    }
  }

  const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    updateValue(e.currentTarget.value)
    const ele = e.currentTarget
    setTimeout(() => {
      ele.style.height = 'auto'
      ele.style.height = ele.scrollHeight + 'px'
    }, 1)
  }

  return (
    <>
      <textarea
        className="text-input"
        value={value}
        ref={inputRef}
        placeholder={placeholder ?? 'How can I help you today?'}
        onKeyDown={onKeyDown}
        onInput={(e) => onInput(e)}
        rows={2}
      />
    </>
  )
}

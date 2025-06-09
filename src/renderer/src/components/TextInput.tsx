import { KeyboardEvent, useRef } from 'react'

interface TextInputProps {
  value: string
  updateValue: (v: string) => void
  onEnter: (v: string) => void
}

export function TextInput({ onEnter, value, updateValue }: TextInputProps): React.JSX.Element {
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
        className="chat-input"
        value={value}
        ref={inputRef}
        placeholder="How can I help you today?"
        onKeyDown={onKeyDown}
        onInput={(e) => onInput(e)}
        rows={2}
      />
    </>
  )
}

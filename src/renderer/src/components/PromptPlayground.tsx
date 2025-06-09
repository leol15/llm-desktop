import React from 'react'
import '../assets/PromptPlayground.css'

export const PromptPlayground = (): React.JSX.Element => {
  return (
    <div id="prompt-playground">
      <div className="playground-container">
        <div className="left-panel">
          <h2>Prompt Playground</h2>
          <textarea className="system-prompt-input" placeholder="Enter system prompt here..." />
          <textarea
            className="user-conversation-input"
            placeholder="Enter user conversation here..."
          />
        </div>
        <div className="right-panel">
          <div className="llm-output-display">
            {/* LLM output will be displayed here */}
            <p>LLM output will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

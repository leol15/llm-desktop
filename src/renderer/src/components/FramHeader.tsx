import { VscChromeMinimize, VscClose, VscPrimitiveSquare } from 'react-icons/vsc'

export const FramHeader = (): React.JSX.Element => {
  return (
    <div id="custom-title-bar">
      <div id="window-title">Hello world</div>
      <div id="window-controls">
        <button id="minimize-btn">
          <VscChromeMinimize />
        </button>
        <button id="maximize-btn">
          <VscPrimitiveSquare />
        </button>
        <button id="close-btn">
          <VscClose />
        </button>
      </div>
    </div>
  )
}

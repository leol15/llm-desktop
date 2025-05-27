export const FramHeader = (): React.JSX.Element => {
  return (
    <div id="custom-title-bar">
      <div id="window-title">Hello world</div>
      <div id="window-controls">
        <button id="minimize-btn">-</button>
        <button id="maximize-btn">▢</button>
        <button id="close-btn">×</button>
      </div>
    </div>
  )
}

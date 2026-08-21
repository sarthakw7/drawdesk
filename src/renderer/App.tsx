export function App() {
  const versionInfo = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`

  return (
    <>
      <h1>Hello from Electron renderer!</h1>
      <p>{'\u{1F44B}'}</p>
      <p>{versionInfo}</p>
    </>
  )
}

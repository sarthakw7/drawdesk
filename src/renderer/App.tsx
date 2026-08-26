import { useEffect, useReducer, useRef, useState } from 'react'
import { createEmptyDrawing } from '../domain/drawing'
import { isDrawingDocument } from '../domain/drawingValidation'
import { drawingReducer } from '../state/drawingReducer'
import { DrawingCanvas, type DrawingCanvasHandle } from './canvas/DrawingCanvas'
import { Toolbar } from './components/Toolbar'
import { availableTools, defaultTool, type ToolId } from './tools/drawingTools'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target instanceof HTMLInputElement
    || target instanceof HTMLTextAreaElement
    || target.isContentEditable
  )
}

const hasActiveTextDraftInput = () => (
  window.document.querySelector('[data-drawdesk-text-input="true"]') !== null
)

export function App() {
  const [document, dispatch] = useReducer(drawingReducer, undefined, createEmptyDrawing)
  const [activeTool, setActiveTool] = useState<ToolId>(defaultTool)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [fileDisplayName, setFileDisplayName] = useState('Untitled')
  const [documentReplacementKey, setDocumentReplacementKey] = useState(0)
  const canvasRef = useRef<DrawingCanvasHandle | null>(null)

  useEffect(() => {
    if (saveStatus !== 'saved') {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setSaveStatus('idle')
    }, 1500)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [saveStatus])

  const handleNewDrawing = async () => {
    const result = await window.drawingFiles.clearCurrent()
    dispatch({
      type: 'replace-document',
      document: createEmptyDrawing(),
    })
    setFileDisplayName(result.fileName)
    setDocumentReplacementKey((currentKey) => currentKey + 1)
  }

  const handleOpenDrawing = async () => {
    const result = await window.drawingFiles.open()

    if (result.status !== 'opened' || !isDrawingDocument(result.document)) {
      return
    }

    const confirmResult = await window.drawingFiles.confirmOpen(result.pendingOpenId)

    if (confirmResult.status !== 'confirmed') {
      return
    }

    dispatch({
      type: 'replace-document',
      document: result.document,
    })
    setFileDisplayName(confirmResult.fileName)
    setDocumentReplacementKey((currentKey) => currentKey + 1)
  }

  const handleSaveDrawing = async () => {
    setSaveStatus('saving')

    try {
      const pendingTextAction = canvasRef.current?.takePendingTextAction() ?? null
      const documentToSave = pendingTextAction
        ? drawingReducer(document, pendingTextAction)
        : document

      if (pendingTextAction) {
        dispatch(pendingTextAction)
      }

      const result = await window.drawingFiles.save(documentToSave)

      if (result.status === 'saved') {
        setFileDisplayName(result.fileName)
        setSaveStatus('saved')
        return
      }

      setSaveStatus('idle')
    } catch {
      setSaveStatus('error')
    }
  }

  const saveStatusText = {
    idle: null,
    saving: 'Saving...',
    saved: 'Saved',
    error: 'Save failed',
  }[saveStatus]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      if (event.metaKey || event.ctrlKey) {
        switch (key) {
          case 'n':
            event.preventDefault()
            void handleNewDrawing()
            return
          case 'o':
            event.preventDefault()
            void handleOpenDrawing()
            return
          case 's':
            event.preventDefault()
            void handleSaveDrawing()
            return
          default:
            return
        }
      }

      if (isEditableTarget(event.target) || hasActiveTextDraftInput()) {
        return
      }

      if (activeTool === 'text' && event.key === '/' && !event.altKey && !event.shiftKey) {
        const didStartText = canvasRef.current?.startTextDraftAtPointer() ?? false

        if (didStartText) {
          event.preventDefault()
          return
        }
      }

      if (event.altKey || event.shiftKey) {
        return
      }

      const tool = availableTools.find((availableTool) => (
        availableTool.shortcut.toLowerCase() === key
      ))

      if (tool) {
        event.preventDefault()
        setActiveTool(tool.id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeTool, document])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      <Toolbar
        fileDisplayName={fileDisplayName}
        onNewDrawing={handleNewDrawing}
        onOpenDrawing={handleOpenDrawing}
        onSaveDrawing={handleSaveDrawing}
        saveStatusText={saveStatusText}
      />
      <DrawingCanvas
        ref={canvasRef}
        document={document}
        dispatch={dispatch}
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        documentReplacementKey={documentReplacementKey}
      />
    </div>
  )
}

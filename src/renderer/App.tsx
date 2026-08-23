import { useEffect, useReducer, useState } from 'react'
import { createEmptyDrawing } from '../domain/drawing'
import { isDrawingDocument } from '../domain/drawingValidation'
import { drawingReducer } from '../state/drawingReducer'
import { DrawingCanvas } from './canvas/DrawingCanvas'
import { Toolbar } from './components/Toolbar'
import { defaultTool, type ToolId } from './tools/drawingTools'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function App() {
  const [document, dispatch] = useReducer(drawingReducer, undefined, createEmptyDrawing)
  const [activeTool, setActiveTool] = useState<ToolId>(defaultTool)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [documentReplacementKey, setDocumentReplacementKey] = useState(0)

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
    await window.drawingFiles.clearCurrent()
    dispatch({
      type: 'replace-document',
      document: createEmptyDrawing(),
    })
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
    setDocumentReplacementKey((currentKey) => currentKey + 1)
  }

  const handleSaveDrawing = async () => {
    setSaveStatus('saving')

    try {
      const result = await window.drawingFiles.save(document)

      if (result.status === 'saved') {
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
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        onNewDrawing={handleNewDrawing}
        onOpenDrawing={handleOpenDrawing}
        onSaveDrawing={handleSaveDrawing}
        saveStatusText={saveStatusText}
      />
      <DrawingCanvas
        document={document}
        dispatch={dispatch}
        activeTool={activeTool}
        documentReplacementKey={documentReplacementKey}
      />
    </div>
  )
}

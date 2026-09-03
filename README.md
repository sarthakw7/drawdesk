# Drawdesk

Drawdesk is a small Electron drawing app built with a React + TypeScript renderer. It currently supports a focused drawing surface with rectangle, ellipse, line, and text tools, selection and dragging, pan/zoom, and basic `.drawdesk` file persistence.

The implementation is intentionally incremental: the domain document model stays small and serializable, while canvas interaction, viewport state, and Electron filesystem access are kept in separate layers.

## Setup

Use Node 24 for local development and CI parity.

Install dependencies:

```sh
npm install
```

Run the app in development mode:

```sh
npm run dev
```

This starts the Vite renderer dev server and Electron together. Electron loads the Vite dev URL in development, so renderer changes use Vite HMR. Main and preload auto-reload are not implemented.

Build the renderer:

```sh
npm run build
```

Run the built app:

```sh
npm start
```

Run checks:

```sh
npm test
npm run typecheck
```

Build a local macOS package:

```sh
npm run package:mac
```

This builds the renderer first, then packages the app with Electron Builder. The current packaging target is macOS arm64 and outputs to `release/`, including `release/mac-arm64/Drawdesk.app` and `release/Drawdesk-1.0.0-arm64.dmg`. Local packages are unsigned and not notarized.

## Tech Stack

- Electron for the desktop shell, native dialogs, and filesystem boundary.
- React and TypeScript for the renderer.
- Vite for renderer development and production builds.
- Konva and React Konva for canvas rendering and pointer/drag interactions.
- Vitest for focused Node-environment unit tests.

## Project Structure

- `main.js`: Electron main process. Creates the window and owns native file dialogs/filesystem access.
- `preload.js`: exposes the narrow renderer API through `contextBridge`.
- `src/domain`: serializable drawing models and document validation.
- `src/state`: framework-independent drawing reducer.
- `src/renderer/App.tsx`: application shell, document reducer wiring, active tool state, and persistence UI behavior.
- `src/renderer/components/Toolbar.tsx`: presentation-focused app/file controls for New/Open/Save and save status.
- `src/renderer/canvas`: Konva canvas composition, tool interactions, shape layers, geometry helpers, viewport state, and zoom controls.
- `src/renderer/canvas/components/ToolPalette.tsx`: floating drawing tool controls for select, pan, rectangle, ellipse, line, and text.
- `scripts/dev.mjs`: starts Vite, waits for the renderer URL, then launches Electron.

## State Model

`DrawingDocument` is the source of truth for committed drawing content:

```ts
{
  schemaVersion: 1,
  shapes: Shape[]
}
```

Shapes are plain data objects for rectangles, ellipses, lines, and text. The reducer supports adding shapes, updating shapes by id and type, clearing the drawing, and replacing the full document.

Editor state is deliberately separate from `DrawingDocument`:

- Viewport state lives in `useViewport` as `{ x, y, zoom }`.
- Selection lives in `DrawingCanvas` as `selectedShapeId`.
- In-progress rectangle/ellipse/line/text drafts live in tool-specific hooks.
- Active tool state lives in `App`.

When New or a successful Open replaces the full document, transient canvas state is cleared. Pan/zoom is not reset.

## Canvas, Coordinates, and Interaction

Konva is the rendering and interaction layer, but it is not the persisted model. Committed shapes are rendered from `DrawingDocument`, and drag-end updates are written back through the reducer so Konva state does not become the source of truth.

The canvas distinguishes screen coordinates from world coordinates:

- Screen coordinates are pointer positions inside the visible stage.
- World coordinates are document coordinates after reversing viewport translation and zoom.
- Drawing and text tools receive world coordinates via `screenToWorld`.
- Text input overlays convert world coordinates back to screen coordinates with `worldToScreen`.

Pan updates only viewport `x`/`y`; it does not mutate shape coordinates. Zoom is clamped to `0.2` through `5` and uses pointer-centered math so the world point under the pointer stays anchored while zooming. Wheel and trackpad/pinch wheel input are supported, and the bottom-right zoom buttons reuse the same zoom calculation around the visible canvas center.

## Electron Boundary and Persistence

The renderer talks to Electron through `window.drawingFiles`, exposed by `preload.js`:

- `save(document)`
- `open()`
- `confirmOpen(pendingOpenId)`
- `clearCurrent()`

The existing `window.versions` preload API is also preserved.

Main process owns native dialogs and filesystem reads/writes. The renderer owns domain validation before accepting opened data.

`.drawdesk` files are JSON containing the versioned `DrawingDocument`. New creates a fresh empty document in renderer state and asks main to clear the current file association. Save writes the current document:

- First Save for a new drawing shows the save dialog and remembers the chosen path in main.
- Later Saves in the same app session write directly to the remembered path.
- Cancelled Save leaves state unchanged.

Open uses a two-step association flow:

1. Main reads and parses the chosen file and stores its path as a pending candidate.
2. Renderer validates the returned data with `isDrawingDocument`.
3. Renderer confirms the pending open with main.
4. Only after confirmation succeeds does renderer replace the current document.

Cancelled, unreadable, invalid, or unconfirmed opens do not replace the current drawing or current file association.

## Engineering Decisions

- The persisted model is plain JSON, not Konva node state.
- Domain and reducer code are framework-independent.
- Native filesystem/dialog behavior stays outside React.
- The preload API is narrow instead of exposing generic IPC.
- Viewport/editor state is separate from document state to avoid saving transient UI state.
- Tool interaction is shared enough to centralize pointer down/move/up flow, but does not use a large tool framework.
- Tests focus on pure domain/reducer/geometry/viewport behavior; there are no UI or Electron tests yet.

## Current Limitations and Non-Goals

Implemented tools are select, pan, rectangle, ellipse, line, and text. The app does not currently implement:

- resize handles or rotation
- multi-select
- undo/redo
- Save As
- autosave or recent files
- persistent file association across app restarts
- clipboard support
- layers
- styling controls
- shape editing beyond dragging selected shapes
- document migrations beyond schema version `1`
- renderer UI tests or Electron integration tests

Main-process Save currently writes the renderer-provided document; opened files are validated in the renderer before replacement.

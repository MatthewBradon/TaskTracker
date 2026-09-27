import { moveTask } from './taskActions'
import type { DragState, PanelData } from './types'

export function startDragSession(panelId: string, index: number): DragState {
  return { from: { panelId, index }, hover: null }
}

export function hoverAt(
  prev: DragState | null,
  panelId: string,
  rawIndex: number
): DragState | null {
  
  if (!prev) return prev
  
  const index = convertToReducedIndex(prev, panelId, rawIndex)

  if (prev.hover?.panelId === panelId && prev.hover.index === index) return prev
  return { ...prev, hover: { panelId, index } }
}

export function commitDrag(drag: DragState | null, panels: PanelData[]): PanelData[] {
  if (!drag?.hover) return panels
  return moveTask(panels, {
    fromPanelId: drag.from.panelId,
    fromIndex: drag.from.index,
    toPanelId: drag.hover.panelId,
    toIndex: drag.hover.index,
  })
}

function convertToReducedIndex(drag: DragState, panelId: string, rawIndex: number): number {
  return drag.from.panelId === panelId && rawIndex > drag.from.index
    ? rawIndex - 1
    : rawIndex
}
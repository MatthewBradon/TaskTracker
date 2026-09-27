import type { PanelData } from './types'

export type PanelMove = {
  fromPanelId: string
  fromIndex: number
  toPanelId: string
  toIndex: number
}

export function moveTask(panels: PanelData[], move: PanelMove): PanelData[] {
  const { fromPanelId, fromIndex, toPanelId, toIndex } = move
  const source = panels.find((p) => p.id === fromPanelId)
  const target = panels.find((p) => p.id === toPanelId)
  if (!source || !target) return panels
  if (fromIndex < 0 || fromIndex >= source.tasks.length) return panels

  if (fromPanelId === toPanelId) {
    if (fromIndex === toIndex) return panels
    return panels.map((p) => {
      if (p.id !== toPanelId) return p
      const tasks = [...p.tasks]
      const [moved] = tasks.splice(fromIndex, 1)
      tasks.splice(toIndex, 0, moved)
      return { ...p, tasks }
    })
  }

  const moved = source.tasks[fromIndex]
  return panels.map((p) => {
    if (p.id === fromPanelId) {
      return { ...p, tasks: p.tasks.filter((_, i) => i !== fromIndex) }
    }
    if (p.id === toPanelId) {
      const tasks = [...p.tasks]
      tasks.splice(Math.min(toIndex, tasks.length), 0, moved)
      return { ...p, tasks }
    }
    return p
  })
}

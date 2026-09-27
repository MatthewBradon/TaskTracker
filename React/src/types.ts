export type Task = {
  id: string
  label: string
}

export type PanelData = {
  id: string
  tasks: Task[]
}

export type DragState = {
  from: { panelId: string; index: number }
  hover: { panelId: string; index: number } | null
}

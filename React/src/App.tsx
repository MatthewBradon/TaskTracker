import { Fragment, useState } from 'react'

import { commitDrag, hoverAt, startDragSession } from './dragActions'
import { InsertPanelZone, Panel } from './Panel'
import type { DragState, PanelData, Task } from './types'

import './App.css'

const initialTasks: Task[] = ['Water the plants', 'Take out the trash', 'Do the laundry'].map((label) => ({
  id: crypto.randomUUID(),
  label,
}))

function App() {
  
  const [panels, setPanels] = useState<PanelData[]>([
    { id: crypto.randomUUID(), tasks: initialTasks },
  ])

  const [drag, setDrag] = useState<DragState | null>(null)

  const addPanelAt = (index: number) =>
    setPanels((prev) => {
      const next = [...prev]
      next.splice(index, 0, { id: crypto.randomUUID(), tasks: [] })
      return next
    })

  const deletePanel = (panelId: string) =>
    setPanels((prev) => prev.filter((p) => p.id !== panelId))

  const addTaskToPanel = (panelId: string, task: string) =>
    setPanels((prev) =>
      prev.map((p) =>
        p.id === panelId
          ? { ...p, tasks: [...p.tasks, { id: crypto.randomUUID(), label: task }] }
          : p
      )
    )

  const startDrag = (panelId: string, index: number) =>
    setDrag(startDragSession(panelId, index))

  const hover = (panelId: string, rawIndex: number) =>
    setDrag((prev) => hoverAt(prev, panelId, rawIndex))

  const endDrag = () => setDrag(null)

  const commit = () => {
    setPanels((prev) => commitDrag(drag, prev))
    setDrag(null)
  }

  return (
    <>
      <h1>My Task List</h1>
      <div className="panels-row">
        {panels.map((panel, index) => (
          <Fragment key={panel.id}>
            <InsertPanelZone
              onInsert={() => addPanelAt(index)}
              label={`Add panel before position ${index + 1}`}
            />
            <Panel
              id={panel.id}
              tasks={panel.tasks}
              drag={drag}
              onDragStart={(i) => startDrag(panel.id, i)}
              onDragOverCard={(i) => hover(panel.id, i)}
              onDragOverEnd={() => hover(panel.id, panel.tasks.length)}
              onDragEnd={endDrag}
              onDrop={commit}
              onAdd={(task) => addTaskToPanel(panel.id, task)}
              onDelete={() => deletePanel(panel.id)}
            />
          </Fragment>
        ))}
        <InsertPanelZone onInsert={() => addPanelAt(panels.length)} label="Add panel at the end" />
      </div>
    </>
  )
}

export default App

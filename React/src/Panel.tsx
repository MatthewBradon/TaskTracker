import { useState } from 'react'
import { CardList } from './Card'
import type { DragState, Task } from './types'

function AddTask({ onAdd }: { onAdd: (task: string) => void }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const submit = () => {
    const trimmed = value.trim()
    if (trimmed) {
      onAdd(trimmed)
      setValue('')
    }
  }

  const close = () => {
    setValue('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button className="add-btn" onClick={() => setOpen(true)} title="Add task">
        +
      </button>
    )
  }

  return (
    <div className="add-row">
      <input
        className="add-input"
        type="text"
        placeholder="New task..."
        value={value}
        autoFocus
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
          if (e.key === 'Escape') close()
        }}
      />
      <button className="icon-btn confirm" onClick={submit} title="Add task">
        ✓
      </button>
      <button className="icon-btn cancel" onClick={close} title="Cancel">
        ✕
      </button>
    </div>
  )
}

export function Panel({
  id,
  tasks,
  drag,
  onDragStart,
  onDragOverCard,
  onDragOverEnd,
  onDragEnd,
  onDrop,
  onAdd,
  onDelete,
}: {
  id: string
  tasks: Task[]
  drag: DragState | null
  onDragStart: (index: number) => void
  onDragOverCard: (index: number) => void
  onDragOverEnd: () => void
  onDragEnd: () => void
  onDrop: () => void
  onAdd: (task: string) => void
  onDelete: () => void
}) {
  const dragIndex = drag?.from.panelId === id ? drag.from.index : null
  const hoverIndex = drag?.hover?.panelId === id ? drag.hover.index : null

  return (
    <div className="panel-slot">
      <div
        className="panel"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          onDrop()
        }}
      >
        <CardList
          tasks={tasks}
          dragIndex={dragIndex}
          hoverIndex={hoverIndex}
          onDragStart={onDragStart}
          onDragOverCard={onDragOverCard}
          onDragEnd={onDragEnd}
        />
        <div
          className={drag !== null ? 'end-zone active' : 'end-zone'}
          onDragOver={(e) => {
            e.preventDefault()
            onDragOverEnd()
          }}
        />
        <AddTask onAdd={onAdd} />
      </div>
      <div className="delete-zone">
        <button className="delete-btn" onClick={onDelete} title="Delete panel">
          🗑
        </button>
      </div>
    </div>
  )
}

export function InsertPanelZone({ onInsert, label }: { onInsert: () => void; label: string }) {
  return (
    <div className="insert-zone">
      <button className="insert-btn" onClick={onInsert} title={label}>
        +
      </button>
    </div>
  )
}
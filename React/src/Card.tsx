import { Fragment } from 'react'
import type { Task } from './types'

function Card({
  task,
  isGhost,
  onDragStart,
  onDragOver,
  onDragEnd,
}: {
  task: Task
  isGhost: boolean
  onDragStart: () => void
  onDragOver: () => void
  onDragEnd: () => void
}) {
  return (
    <div
      className={isGhost ? 'card dragging' : 'card'}
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => {
        e.preventDefault()
        onDragOver()
      }}
      onDragEnd={onDragEnd}
    >
      {task.label}
    </div>
  )
}

export function CardList({
  tasks,
  dragIndex,
  hoverIndex,
  onDragStart,
  onDragOverCard,
  onDragEnd,
}: {
  tasks: Task[]
  dragIndex: number | null
  hoverIndex: number | null
  onDragStart: (index: number) => void
  onDragOverCard: (index: number) => void
  onDragEnd: () => void
}) {
  const placeholder = <div className="card placeholder" />

  const displayIndex = determinePlaceholderIndex(dragIndex, hoverIndex)

  return (
    <div
      className="card-list"
      onDragOver={(e) => e.preventDefault()}
    >
      {tasks.map((task, index) => (
        <Fragment key={task.id}>
          {displayIndex === index && placeholder}
          <Card
            task={task}
            isGhost={dragIndex === index}
            onDragStart={() => onDragStart(index)}
            onDragOver={() => onDragOverCard(index)}
            onDragEnd={onDragEnd}
          />
        </Fragment>
      ))}
      {displayIndex !== null && displayIndex >= tasks.length && placeholder}
    </div>
  )
}

function determinePlaceholderIndex(
  dragIndex: number | null,
  hoverIndex: number | null,
): number | null {
    if (hoverIndex === null) return null
    if (dragIndex !== null && hoverIndex >= dragIndex) return hoverIndex + 1
    return hoverIndex
}
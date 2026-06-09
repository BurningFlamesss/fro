import BottomBar from '#/components/BottomBar.tsx';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div>
      <BottomBar />
    </div>
  )
}

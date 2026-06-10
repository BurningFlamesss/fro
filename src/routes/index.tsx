import { createFileRoute } from '@tanstack/react-router'
import BottomBar from '#/components/BottomBar.tsx';
import WindowOverlays from '#/components/WindowOverlays.tsx';

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div>
      <WindowOverlays />
      <BottomBar />
    </div>
  )
}

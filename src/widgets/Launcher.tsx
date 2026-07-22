import type { WidgetProps } from '../constants';

function Launcher({ props }: WidgetProps) {
  console.log("Props: ", props)

  return (
    <div>Launcher</div>
  )
}

export default Launcher
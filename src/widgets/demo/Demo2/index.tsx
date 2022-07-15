import { MarsButton, MarsDialog } from "@mars/components/MarsUI"
import { activate } from "@mars/common/store/widget"

export default function (props) {
  return (
    <MarsDialog title="demo2" left={400} top={10} width={300} {...props}>
      <MarsButton onClick={() => activate("demo")}>测试</MarsButton>
    </MarsDialog>
  )
}

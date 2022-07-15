import type { WidgetState } from "@mars/common/store/widget"
import { lazy } from "react"

const widgetState: WidgetState = {
  widgets: [
    {
      component: lazy(() => import("@mars/widgets/demo/Demo")),
      name: "demo"
    },
    {
      component: lazy(() => import("@mars/widgets/demo/Demo2")),
      name: "demo2"
    }
  ],
  openAtStart: ["demo2"]
}

export default widgetState

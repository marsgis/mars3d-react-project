import type { WidgetState } from "@mars/common/store/widget"
import { lazy } from "react"

const widgetState: WidgetState = {
  widgets: [
    {
      component: lazy(() => import("@mars/widgets/basic/ToolBar")),
      name: "toolbar"
    },
    {
      component: lazy(() => import("@mars/widgets/basic/QureyPoi")),
      name: "qurey-poi"
    },
    {
      component: lazy(() => import("@mars/widgets/basic/ManageBasemap")),
      name: "manage-basemap",
      group: "manage"
    },
    {
      component: lazy(() => import("@mars/widgets/basic/Layer")),
      name: "layers",
      group: "manage",
      disableOther: ["roamLine"]
    },
    {
      component: lazy(() => import("@mars/widgets/basic/Layer/layerComponent")),
      name: "layerComponent"
    },
    {
      component: lazy(() => import("@mars/widgets/basic/Layer/layerGuihua")),
      name: "layer-picture-guihua"
    },
    {
      component: lazy(() => import("@mars/widgets/basic/Layer/layerHeatmap")),
      name: "layer-picture-heatmap"
    },
    {
      component: lazy(() => import("@mars/widgets/basic/LocationPoint")),
      name: "location-point",
      group: "tools"
    }
  ],
  openAtStart: ["toolbar", "qurey-poi"]
}

export default widgetState

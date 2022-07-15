import "mars3d/dist/mars3d.css"
import "@mars/assets/style/index.less"

import { createRoot } from "react-dom/client"
import MainView from "@mars/components/MarsWork/MainView"
import { generateWidgetView } from "@mars/common/store/widget"
import widgetState from "./widget-state"

const WidgetView = generateWidgetView(widgetState)

const reactApp = createRoot(document.getElementById("root"))

reactApp.render(
  <MainView>
    <WidgetView></WidgetView>
  </MainView>
)

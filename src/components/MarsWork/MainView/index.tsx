import { useCallback, useState } from "react"
import MarsMap from "../MarsMap"
import type { Map } from "mars3d"
import "./MainView.less"

interface MainViewProps {
  children: any
}

const configUrl = `${process.env.BASE_URL}config/config.json`

function MainView(props: MainViewProps) {
  const [loaded, setLoaded] = useState(false)

  const marsOnload = useCallback((map: Map) => {
    window._mapInstance = map
    setLoaded(true)
  }, [])

  return (
    <div className="mars-main-view" id="mars-main-view">
      <div id="centerDiv" className="centerDiv-container">
        <MarsMap url={configUrl} onLoad={marsOnload}></MarsMap>
      </div>
      {loaded && props.children}
    </div>
  )
}

export default MainView

import { MarsPannel, MarsIcon, MarsDropdown, MarsMenu } from "@mars/components/MarsUI"
import { Fragment } from "react"
import { activate } from "@mars/common/store/widget"
import styles from "./index.module.less"

export default function (props) {
  const data = [
    { name: "底图", icon: "international", widget: "manage-basemap" },
    { name: "图层", icon: "layers", widget: "layers" },
    {
      name: "工具",
      icon: "tool",
      children: [
        // { name: "图上量算", icon: "ruler", widget: "measure" },
        // { name: "空间分析", icon: "analysis", widget: "analysis" },
        { name: "坐标定位", icon: "local", widget: "location-point" }
        // { name: "地区导航", icon: "navigation", widget: "location-region" },
        // { name: "我的标记", icon: "mark", widget: "addmarker" },
        // { name: "视角书签", icon: "bookmark", widget: "bookmark" },
        // { name: "地图打印", icon: "printer", widget: "print" },
        // { name: "飞行漫游", icon: "take-off", widget: "roamLine-list" },
        // { name: "图上标绘", icon: "hand-painted-plate", widget: "plot" },
        // { name: "路线导航", icon: "connection", widget: "query-route" },
        // { name: "卷帘对比", icon: "switch-contrast", widget: "map-split" },
        // { name: "分屏对比", icon: "full-screen-play", widget: "map-compare" }
      ]
    }
  ]

  const showWidget = (widget: string) => {
    activate(widget)
  }

  return (
    <MarsPannel right={10} top={10} customClass={styles["toolbar-pannel"]} {...props}>
      {data.map((item, i) => (
        <Fragment key={i}>
          {item.widget && !item.children && (
            <div className={styles["toolbar-item"]} onClick={() => showWidget(item.widget)}>
              <MarsIcon className={styles["toolbar-icon"]} icon={item.icon} width="18"></MarsIcon>
              <span className="title">{item.name}</span>
            </div>
          )}
          {item.children && !item.widget && (
            <MarsDropdown
              trigger={["hover"]}
              placement="bottomRight"
              menu={{
                items: item.children.map((child) => ({
                  key: child.widget,
                  label: (
                    <div title={child.name} onClick={() => showWidget(child.widget)}>
                      <MarsIcon className={styles["toolbar-icon"]} icon={child.icon} width="18"></MarsIcon>
                      <span>{child.name}</span>
                    </div>
                  )
                }))
              }}
            >
              <div className={styles["toolbar-item"]}>
                <MarsIcon className={styles["toolbar-icon"]} icon={item.icon} width="18"></MarsIcon>
                <span className="title">{item.name}</span>
                <MarsIcon icon="down" width="18"></MarsIcon>
              </div>
            </MarsDropdown>
          )}
        </Fragment>
      ))}
    </MarsPannel>
  )
}

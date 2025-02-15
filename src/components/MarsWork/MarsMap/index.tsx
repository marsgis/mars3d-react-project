import { useEffect } from "react"

import * as mars3d from "mars3d"
import "./expand/index" // 引入插件或注册扩展js

import { $alert, $message } from "@mars/components/MarsUI"
import { getQueryString } from "@mars/utils/mars-util"
import { getDefaultContextMenu } from "@mars/utils/getDefaultContextMenu"
import "./index.less"

interface MarsMapProps {
  url: string
  mapKey?: string
  options?: any
  onLoad?: (map: mars3d.Map) => void
}

function MarsMap(props: MarsMapProps) {
  // 使用用户传入的 mapKey 拼接生成 withKeyId 作为当前显示容器的id
  const withKeyId = `mars3d-container-${props.mapKey}`
  console.log("MarsMap")

  // 用于存放地球组件实例
  let map: mars3d.Map // 地图对象

  useEffect(() => {
    initMars3d()

    return () => {
      if (map) {
        map.destroy()
      }
      console.log("map销毁完成", map)
    }
  }, [])

  const initMars3d = async () => {
    // 获取配置
    let mapOptions
    if (props.url) {
      // 存在url时才读取
      mapOptions = await mars3d.Util.fetchJson({ url: props.url })
    }

    if (props.options) {
      // 存在叠加的属性时
      let exOptions
      if (props.options.then) {
        exOptions = await props.options
      } else {
        exOptions = props.options
      }

      if (mapOptions) {
        mapOptions = mars3d.Util.merge(mapOptions, exOptions) // 合并配置
      } else {
        mapOptions = exOptions
      }
    }
    // logInfo("地图构造参数", mapOptions)

    map = new mars3d.Map(withKeyId, mapOptions)

    // 绑定当前项目的默认右键菜单
    map.bindContextMenu(getDefaultContextMenu(map))

    // 如果有xyz传参，进行定位
    const lat = getQueryString("lat")
    const lng = getQueryString("lng")
    if (lat && lng) {
      map.flyToPoint(new mars3d.LngLatPoint(lng, lat), { duration: 0 })
    }

    // 开场动画
    // map.openFlyAnimation();

    // 针对不同终端的优化配置
    if (mars3d.Util.isPCBroswer()) {
      map.zoomFactor = 2.0 // 鼠标滚轮放大的步长参数

      // IE浏览器优化
      if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 0) {
        map.viewer.targetFrameRate = 20 // 限制帧率
        map.scene.requestRenderMode = false // 取消实时渲染
      }
    } else {
      map.zoomFactor = 5.0 // 鼠标滚轮放大的步长参数

      // 移动设备上禁掉以下几个选项，可以相对更加流畅
      map.scene.requestRenderMode = false // 取消实时渲染
      map.scene.fog.enabled = false
      map.scene.skyAtmosphere.show = false
      map.scene.globe.showGroundAtmosphere = false
    }

    // //二三维切换不用动画
    if (map.viewer.sceneModePicker) {
      map.viewer.sceneModePicker.viewModel.duration = 0.0
    }

    // webgl渲染失败后，刷新页面
    map.on(mars3d.EventType.renderError, async () => {
      await $alert("程序内存消耗过大，请重启浏览器")
      window.location.reload()
    })

    // map构造完成后的一些处理
    onMapLoad()

    props.onLoad(map)
  }

  // map构造完成后的一些处理
  function onMapLoad() {
    // Mars3D地图内部使用，如右键菜单弹窗
    // @ts-ignore
    window.globalAlert = $alert
    // @ts-ignore
    window.globalMsg = $message

    // 用于 config.json 中 西藏垭口 图层的详情按钮 演示
    // @ts-ignore
    window.showPopupDetails = (item: any) => {
      $alert(item.NAME)
    }

    // 用于 config.json中配置的图层，绑定额外方法和参数
    const tiles3dLayer = map.getLayer(204012, "id") // 上海市区
    if (tiles3dLayer) {
      tiles3dLayer.options.onSetOpacity = function (opacity: number) {
        tiles3dLayer.style = {
          color: {
            conditions: [
              ["${floor} >= 200", "rgba(45, 0, 75," + 0.5 * opacity + ")"],
              ["${floor} >= 100", "rgba(170, 162, 204," + opacity + ")"],
              ["${floor} >= 50", "rgba(224, 226, 238," + opacity + ")"],
              ["${floor} >= 25", "rgba(252, 230, 200," + opacity + ")"],
              ["${floor} >= 10", "rgba(248, 176, 87," + opacity + ")"],
              ["${floor} >= 5", "rgba(198, 106, 11," + opacity + ")"],
              ["true", "rgba(127, 59, 8," + opacity + ")"]
            ]
          }
        }
      }
    }
  }

  return <div id={withKeyId} className="mars3d-container"></div>
}

export default MarsMap

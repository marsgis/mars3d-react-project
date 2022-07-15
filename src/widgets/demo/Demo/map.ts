/**
 * 分屏对比
 * @copyright 火星科技 mars3d.cn
 * @author 火星胡椒 2022-01-10
 */
import * as mars3d from "mars3d"
import "./mapCompare.less"
let map: mars3d.Map // 地图对象
let mapEx: mars3d.Map

let centerDiv: HTMLElement

// 初始化当前业
export function onMounted(mapInstance: mars3d.Map): void {
  console.log("分屏对比")

  map = mapInstance // 记录map

  // 双屏对比实现  参数配置
  const marsDiv = document.getElementById("mars-main-view")
  const centerDivEx = mars3d.DomUtil.create("div", "", marsDiv)
  centerDivEx.setAttribute("id", "centerDivEx")
  centerDivEx.style.display = "block"
  const mars3dContainerEx = mars3d.DomUtil.create("div", "mars3d-container", centerDivEx)
  mars3dContainerEx.setAttribute("id", "mars3dContainerEx")

  centerDiv = document.getElementById("centerDiv")
  centerDiv.style.right = "-50%"
  const center: HTMLElement = map.container
  center.style.width = "50%"

  const mapOptions2 = map.getOptions()
  // 绑定的控件
  mapOptions2.control.baseLayerPicker = true // basemaps底图切换按钮
  mapOptions2.control.sceneModePicker = false

  // 用于双屏同图层，不同配置展示
  mapOptions2.layers.forEach((item) => {
    if (item.compare) {
      // 存在compare属性时
      for (const key in item.compare) {
        item[key] = item.compare[key]
      }
    }
  })

  // 后置加的图层的处理
  const mapLayers = map.getLayers({
    basemaps: false, // 排除config.json中的basempas
    layers: false // 排除config.json中的layers
  })

  for (let i = mapLayers.length - 1; i >= 0; i--) {
    const layer = mapLayers[i]
    if (layer.isPrivate || layer.parent) {
      continue
    }
    mapOptions2.layers.push(layer.toJSON())
  }

  console.log("分屏地图配置", mapOptions2)

  mapEx = new mars3d.Map(mars3dContainerEx, mapOptions2)
  mapEx.basemap = "天地图电子"

  map.on(mars3d.EventType.cameraChanged, mapExtentChange)
  map.camera.percentageChanged = 0.01

  mapEx.on(mars3d.EventType.cameraChanged, mapExExtentChange)
  mapEx.camera.percentageChanged = 0.01

  mapExtentChange()
}

// 释放当前业务
export function onUnmounted(): void {
  // 组件销毁时的操作
  map.off(mars3d.EventType.cameraChanged, mapExtentChange)
  mapEx.off(mars3d.EventType.cameraChanged, mapExExtentChange)

  const centerDivDom: HTMLElement = map.container
  centerDivDom.style.height = "100%"
  centerDivDom.style.width = "100%"
  centerDivDom.style.right = "0"
  centerDiv.style.right = "0"

  const creatDom: HTMLElement = document.getElementById("centerDivEx")
  creatDom.remove()
  map = null
}

function mapExtentChange() {
  mapEx.off(mars3d.EventType.cameraChanged, mapExExtentChange)

  updateView(map, mapEx)
  mapEx.on(mars3d.EventType.cameraChanged, mapExExtentChange)
}

function mapExExtentChange() {
  map.off(mars3d.EventType.cameraChanged, mapExtentChange)

  updateView(mapEx, map)
  map.on(mars3d.EventType.cameraChanged, mapExtentChange)
}

// “变化屏”mapChange变化，将“被更新屏”mapUpdate同步更新
function updateView(mapChange: mars3d.Map, mapUpdate: mars3d.Map) {
  const view = mapChange.getCameraView()
  mapUpdate.setCameraView(view, { duration: 0 })
}

// 获取图层数据
export function getAllLayers() {
  return mapEx.getLayers({
    basemaps: true, // 是否取config.json中的basempas
    layers: true // 是否取config.json中的layers
  })
}

export function addLayer(layer: mars3d.layer.BaseLayer) {
  mapEx.addLayer(layer)
}

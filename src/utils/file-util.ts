/**
 * 文件处理相关 静态Util方法
 *
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2022-01-01
 */
import { toKml } from "kml-geojson"
import { flushSync } from "react-dom"
import { createRoot } from "react-dom/client"
import _ from "lodash"

export function saveJSON(data: any[]) {
  if (data == null || !data) {
    alert("当前未标记任何数据！")
  } else {
    const strData = JSON.stringify(data)

    const aLink = document.createElement("a")
    aLink.download = "我的标记点.json"
    const blob = new Blob([strData])
    aLink.href = URL.createObjectURL(blob)
    document.body.appendChild(aLink)
    aLink.click()
    document.body.removeChild(aLink)
  }
}

/**
 * 读取json文件内容
 *
 * @template T 返回的数据类型
 * @param {*} file 文件选择框选择的文件对象
 * @return {*}  {Promise<T>}
 */
export function readJSON<T>(file: any): Promise<T> {
  return new Promise((resolve) => {
    console.log(file)

    const fileName = file.name
    const fileType = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()
    if (fileType !== "json") {
      alert("文件类型不合法,请选择json格式标注文件！")
      return
    }

    if (window.FileReader) {
      const reader = new FileReader()
      reader.readAsText(file, "UTF-8")
      reader.onloadend = function () {
        resolve(JSON.parse(this.result as string))
      }
    }
  })
}

export function saveGeoJSON2Kml(geojson: object|string, options: any): any {
  const kml = toKml(geojson, {
    name: "Mars3D标绘数据",
    documentName: "Mars3D标绘数据文件",
    documentDescription: "标绘数据 by mars3d.cn",
    simplestyle: true,
    ...options
  })
  return kml
}

/**
 * react 组件示例化为Popup的DOM
 *
 * @param {*} comp 传入的 react 组件
 * @return {*}  HTMLElement
 */
export function initReactPopup(comp) {
  const vNodeDom = document.createElement("div")
  const vNode = createRoot(vNodeDom)
  flushSync(() => {
    vNode.render(comp)
  })

  return vNodeDom
}

/**
 * ts下为window定义全局变量
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2022-01-01
 */
import { Map } from "mars3d"

export { }
declare global {
  interface Window {
    _mapInstance: Map // map地图对象
    toolBarMenuData: any
  }
}

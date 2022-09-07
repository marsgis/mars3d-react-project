import { withLifeCyle } from "@mars/common/uses/useLifecycle"
import { MarsDialog, MarsGui, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map"
import styles from "./index.module.less"
import { Component, createRef } from "react"

class LocationPoint extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      marsGuiRef: createRef(),
      options: [
        {
          type: "radio",
          field: "type",
          label: "类型",
          value: "1",
          options: [
            {
              label: "十进制",
              value: "1"
            },
            {
              label: "度分秒",
              value: "2"
            },
            {
              label: "平面坐标",
              value: "3"
            }
          ]
        },
        {
          type: "input",
          field: "lng",
          label: "经度",
          value: 117.270617,
          show(data) {
            return data.type === "1"
          },
          change: (value: Number, data: any) => {
            this.changeDmsGk(data)
          }
        },
        {
          type: "input",
          field: "lat",
          label: "纬度",
          value: 31.815012,
          show(data) {
            return data.type === "1"
          },
          change: (value: Number, data: any) => {
            this.changeDmsGk(data)
          }
        },
        {
          type: "input",
          field: "alt",
          label: "高程",
          value: 0,
          show(data) {
            return data.type === "1"
          },
          change: (value: Number, data: any) => {
            this.changeDmsGk(data)
          }
        },
        {
          type: "inputGroup",
          field: "lngDMS",
          label: "经度",
          value: [117, 16, 14],
          units: ["度", "分", "秒"],
          show(data) {
            return data.type === "2"
          },
          change: (value: Number[], data: any) => {
            this.changeGk(data)
          }
        },
        {
          type: "inputGroup",
          field: "latDMS",
          label: "纬度",
          value: [31, 48, 54],
          units: ["度", "分", "秒"],
          show(data) {
            return data.type === "2"
          },
          change: (value: Number[], data: any) => {
            this.changeGk(data)
          }
        },
        {
          type: "input",
          field: "altDMS",
          label: "高程",
          value: 0,
          show(data) {
            return data.type === "2"
          },
          change: (value: Number, data: any) => {
            this.changeGk(data)
          }
        },
        {
          type: "radio",
          field: "radioFendai",
          label: "分带",
          value: "1",
          options: [
            {
              label: "三度带",
              value: "1"
            },
            {
              label: "六度带",
              value: "2"
            }
          ],
          change: (value: String, data: any) => {
            this.changeValue(data)
          },
          show(data) {
            return data.type === "3"
          }
        },
        {
          type: "input",
          field: "gk6X",
          label: "纵坐标",
          value: 39525622.7,
          show(data) {
            return data.type === "3"
          },
          change: (value: Number, data: any) => {
            this.changeDms(data)
          }
        },
        {
          type: "input",
          field: "gk6Y",
          label: "横坐标",
          value: 3521371.9,
          show(data) {
            return data.type === "3"
          },
          change: (value: Number, data: any) => {
            this.changeDms(data)
          }
        },
        {
          type: "input",
          field: "gkAlt",
          label: "高度值",
          value: 0,
          show(data) {
            return data.type === "3"
          },
          change: (value: Number, data: any) => {
            this.changeDms(data)
          }
        },
        {
          type: "custom",
          label: "",
          element: (
            <div className="f-tac">
              <Space>
                <MarsButton
                  onClick={() => {
                    mapWork.bindMourseClick()
                  }}
                >
                  图上拾取
                </MarsButton>
                <MarsButton
                  onClick={() => {
                    this.submitCenter()
                  }}
                >
                  坐标定位
                </MarsButton>
              </Space>
            </div>
          )
        }
      ]
    }

    // 图上拾取的坐标
    mapWork.eventTarget.on("clickMap", (event: any) => {
      const data = {
        lng: event.point.lng,
        lat: event.point.lat,
        alt: event.point.alt
      }

      this.marsUpdataPosition(data)
      this.marsPointTrans(data)
      this.marsProj4Trans(data)

      // 添加图标点
      mapWork.updateMarker(false, data.lng, data.lat, data.alt)
    })
  }

  //   组件渲染完成加载默认的中心点位置
  componentDidMount() {
    const defaultPoitn = mapWork.defultPoint()

    this.marsUpdataPosition(defaultPoitn)
    this.marsPointTrans(defaultPoitn)
    this.marsProj4Trans(defaultPoitn)
  }

  // 界面一
  changeDmsGk(data) {
    this.marsPointTrans(data)
    this.marsProj4Trans(data)
  }

  // 界面二
  changeGk(data) {
    this.state.marsGuiRef.current?.updateField(
      "lng",
      mapWork.marsDms2degree(
        mapWork.marsUtilFormtNum(data.lngDMS[0], 6),
        mapWork.marsUtilFormtNum(data.lngDMS[1], 6),
        mapWork.marsUtilFormtNum(data.lngDMS[2], 6)
      )
    )
    this.state.marsGuiRef.current?.updateField(
      "lat",
      mapWork.marsDms2degree(
        mapWork.marsUtilFormtNum(data.latDMS[0], 6),
        mapWork.marsUtilFormtNum(data.latDMS[1], 6),
        mapWork.marsUtilFormtNum(data.latDMS[2], 6)
      )
    )
    this.state.marsGuiRef.current?.updateField("alt", data.altDMS)

    this.marsProj4Trans(data)
  }

  // 界面三
  changeDms(data) {
    this.marsZONEtoCRS(data)
    this.marsPointTrans(data)
  }

  // 更新度分秒
  marsUpdataPosition(data) {
    this.state.marsGuiRef.current?.updateField("lng", mapWork.marsUtilFormtNum(data.lng, 6))
    this.state.marsGuiRef.current?.updateField("lat", mapWork.marsUtilFormtNum(data.lat, 6))
    this.state.marsGuiRef.current?.updateField("alt", mapWork.marsUtilFormtNum(data.alt, 6))
  }

  // 平面坐标转经纬度并更新
  marsZONEtoCRS(data) {
    const zone = mapWork.marsZONEtoCRS(Number(data.gk6X), Number(data.gk6Y), data.radioFendai)

    this.state.marsGuiRef.current?.updateField("lng", mapWork.marsUtilFormtNum(zone[0], 6))
    this.state.marsGuiRef.current?.updateField("lat", mapWork.marsUtilFormtNum(zone[1], 6))
    this.state.marsGuiRef.current?.updateField("alt", data.gkAlt)
  }

  // 十进制转2000平面三分度六分度
  changeValue(data) {
    this.marsZONEtoCRS(data)
    this.marsProj4Trans(data)
  }

  // 经纬度转平面坐标并更新
  marsProj4Trans(data) {
    const zone = mapWork.marsProj4Trans(
      mapWork.marsUtilFormtNum(data.lng, 6),
      mapWork.marsUtilFormtNum(data.lat, 6),
      this.state.marsGuiRef.current?.getValue("radioFendai")
    )
    this.state.marsGuiRef.current?.updateField("gk6X", mapWork.marsUtilFormtNum(zone[0], 1))
    this.state.marsGuiRef.current?.updateField("gk6Y", mapWork.marsUtilFormtNum(zone[1], 1))
    this.state.marsGuiRef.current?.updateField("gkAlt", mapWork.marsUtilFormtNum(data.alt, 6))
  }

  // 经纬度转度分秒并更新
  marsPointTrans(data) {
    const lngDMS = [mapWork.marsPointTrans(data.lng).degree, mapWork.marsPointTrans(data.lng).minute, mapWork.marsPointTrans(data.lng).second]
    const latDMS = [mapWork.marsPointTrans(data.lat).degree, mapWork.marsPointTrans(data.lat).minute, mapWork.marsPointTrans(data.lat).second]

    this.state.marsGuiRef.current?.updateField("lngDMS", lngDMS)
    this.state.marsGuiRef.current?.updateField("latDMS", latDMS)
    this.state.marsGuiRef.current?.updateField("altDMS", mapWork.marsUtilFormtNum(data.alt, 6))
  }

  // 坐标定位
  submitCenter() {
    const data = this.state.marsGuiRef.current?.getValues()
    mapWork.updateMarker(true, data.lng, data.lat, data.alt)
  }

  render() {
    return (
      <MarsDialog title="坐标拾取" handles="false" right={10} top={60} width={356} {...this.props}>
        <div className={styles.selectPoint}>
          <MarsGui ref={this.state.marsGuiRef} options={this.state.options} formProps={{ labelCol: { span: 4 } }}></MarsGui>
        </div>
      </MarsDialog>
    )
  }
}

export default withLifeCyle(LocationPoint, mapWork)

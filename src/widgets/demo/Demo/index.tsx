import * as mapWork from "./map"
import { useLifecycle } from "@mars/common/uses/useLifecycle"
import { MarsDialog, MarsTree } from "@mars/components/MarsUI"
import { useState, useCallback, useEffect } from "react"

const layersObj: any = {}
const expandNode = [] // 展开的节点
export default function (props) {
  useLifecycle(mapWork)
  const [treeData, setTree] = useState<any[]>([])
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]) // 默认展开的节点
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]) // 默认勾选的节点

  useEffect(() => {
    initTree()
  }, [])

  // 初始化树构件
  const initTree = useCallback(() => {
    const treeNode = [] // 父节点
    const layers = mapWork.getAllLayers()
    // 遍历出config.json中所有的basempas和layers
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i]

      if (layer && layer.pid === -1) {
        const node: any = {
          title: layer.name,
          key: layer.id,
          id: layer.id,
          pId: layer.pid
        }
        node.children = findChild(node, layers)
        treeNode.push(node)
        expandNode.push(node.key)
        layersObj[layer.id] = layer
      }
    }

    setTree(treeNode)
    setExpandedKeys(expandNode)
  }, [])

  // 查找子节点
  const findChild = useCallback((parent: any, list: any[]) => {
    const checkedNode = []
    return list
      .filter((item: any) => item.pid === parent.id)
      .map((item: any) => {
        const node: any = {
          title: item.name,
          key: item.id,
          id: item.id,
          pId: item.pid,
          group: item.type === "group"
        }
        layersObj[item.id] = item
        expandNode.push(node.key)
        if (item.hasEmptyGroup) {
          node.children = findChild(node, list)
        }
        if (item.isAdded && item.show) {
          checkedNode.push(node.key)
          setCheckedKeys(checkedNode)
        }

        return node
      })
  }, [])

  // 勾选复选框
  const checkedChange = useCallback((keys: string[], e: any) => {
    setCheckedKeys(keys)
    const layer = layersObj[e.node.key]

    if (layer) {
      if (!layer.isAdded) {
        mapWork.addLayer(layer)
      }

      // 处理子节点
      if (e.node.children && e.node.children.length) {
        renderChildNode(keys, e.node.children)
      }

      if (keys.indexOf(e.node.key) !== -1) {
        layer.show = true
        layer.flyTo()
      } else {
        layer.show = false
      }
    }
  }, [])

  const renderChildNode = useCallback((keys: string[], children: any[]) => {
    children.forEach((child) => {
      const layer = layersObj[child.key]
      if (layer) {
        if (!layer.isAdded) {
          mapWork.addLayer(layer)
        }

        if (keys.indexOf(child.key) !== -1) {
          layer.show = true
        } else {
          layer.show = false
        }
        if (child.children) {
          renderChildNode(keys, child.children)
        }
      }
    })
  }, [])
  return (
    <MarsDialog title="分屏对比" top={60} left={10} bottom={60} width={260} {...props}>
      <MarsTree
        treeData={treeData}
        checkable
        onExpand={(expandedKeysValue) => setExpandedKeys(expandedKeysValue)}
        expandedKeys={expandedKeys}
        checkedKeys={checkedKeys}
        onCheck={checkedChange}
      ></MarsTree>
    </MarsDialog>
  )
}

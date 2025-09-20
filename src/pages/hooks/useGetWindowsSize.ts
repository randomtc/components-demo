//监听窗口尺寸变化

import React from "react"

const useGetWindowsSize = () => {
  const [obj, setObj] = React.useState<Record<string, string | number>>()

  const getSize = React.useCallback(() => {
    setObj({
      bodyWidth: document.body.clientWidth,
    })
  }, [])

  React.useEffect(() => {
    getSize()
    window.addEventListener("resize", getSize) // 监听窗口元素变化
    return () => {
      window.removeEventListener("resize", getSize)
    }
  }, [])

  return obj
}

export default useGetWindowsSize

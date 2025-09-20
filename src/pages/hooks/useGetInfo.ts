/**
 * 函数参数
 * @param  request         网络请求
 * @param  params          请求参数
 * @param  notSend         是否发送请求 初始化默认发送
 * -------------------------------------------------------------*
 * 返回参数
 * @param  data            请求成功数据
 * @param  trigger         重新请求的开关
 * @param  getData         请求函数
 */
import React from "react"

interface UseGetInfoProps {
  request: any
  params?: Record<string, any>
  notSend?: boolean
}
const useGetInfo = (props: UseGetInfoProps) => {

  const Button = <T,>() => {
    interface btnType {
      type: 'link' | 'define' | 'deguer'
      onClick: (...set: any) => void
      className: ''
    }
  }

  const [data, setData] = React.useState<any>()
  const [loading, setLoading] = React.useState<boolean>()
  const getData = async () => {
    setLoading(true)
    try {
      const res = await props?.request?.(props?.params)
      if (res?.code === 200) {
        setData(res)
      } else {
        console.error(res)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (!props?.notSend) {
      getData()
    }
  }, [])
  return { data, getData, loading }
}

export default useGetInfo

/**
 * @param  request       网络请求
 * @param  params        请求参数
 * @param  success       成功后的操作
 * @param  tip           提示信息
 * @param  notSend       是否发送请求true不发送 默认发送
 * @param  submitLoading 请求状态
 * @param  submitId      提交Id
 */
import React from 'react'
import { message } from 'antd'

interface SubmitType {
    request?: (params?: Record<string, any>) => Promise<any> | void
    params: Record<string, any>
    success?: (...set: any) => void
    tip?: string | null
    notSend?: boolean
}
type Id = string | number | undefined
interface UseSubmitReturn {
    setSubmit: React.Dispatch<React.SetStateAction<SubmitType>>
    submitLoading: boolean
    submitId?: Id
    setSubmitId?: React.Dispatch<React.SetStateAction<Id>>
}

const useSubmit = (): UseSubmitReturn => {
    const [submit, setSubmit] = React.useState<SubmitType>({
        request: () => {},
        params: {},
        success: () => {},
        tip: null,
        notSend: false
    })
    const [submitLoading, setSubmitLoading] = React.useState<boolean>(false)
    const [submitId, setSubmitId] = React.useState<Id>()

    const sendRequest = React.useCallback(async () => {
        setSubmitLoading(true)
        try {
            const res = await submit?.request?.(submit?.params)
            if (res?.code === 200) {
                submit?.success!(res)
                message.success(submit?.tip ?? '操作成功')
            } else {
                console.error(res)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setSubmit({ params: {} })
            setSubmitLoading(false)
        }
    }, [submit])

    React.useEffect(() => {
        if (Object.keys(submit?.params).length && !submit?.notSend) {
            sendRequest()
        }
    }, [submit, sendRequest])

    return { setSubmit, submitLoading, submitId, setSubmitId }
}

export default useSubmit

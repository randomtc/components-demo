/**
 * @param  num     倒计时开始时间
 */
import { useEffect, useRef, useState } from 'react'

interface IndexProps {
    num: number
}

const Index = ({ num }: IndexProps) => {
    const [time, setTime] = useState(num)
    const timeRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        timeRef.current = setInterval(() => {
            setTime(prevTime => prevTime - 1)
        }, 1000)
        return () => clearInterval(timeRef.current)
    }, [])

    return time
}

export default Index





import React, { useRef, useState, useEffect } from "react";
import { Tooltip } from "antd";

interface IProps {
  text: string;
  width?: string | number;
  maxLines?: number; // 控制最大行数
}

const TextEllipsis = ({ text, width = "100%", maxLines = 1 }: IProps) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      // 检查实际可用空间是否小于内容的空间
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  }, [text, width]);

  const textStyle: React.CSSProperties = {
    width: width,
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: maxLines, // 控制最大行数
    textOverflow: "ellipsis",
    verticalAlign: "top",
    lineHeight: '1.5em', // 行高，确保行数计算正确
  };

  return (
    <Tooltip title={isOverflowing ? text : ""} >
      <span ref={textRef} style={textStyle}>
        {text} 
      </span>
    </Tooltip>
  );
};

export default TextEllipsis;
export const markdownText = `
# Markdown 示例文档

## 简介
这是一个示例 Markdown 文档，展示了 **标题、列表、表格和代码块** 的用法。

---

## 表格示例

| 序号 | 姓名   | 年龄 | 职业       |
|------|--------|------|------------|
| 1    | 张三   | 28   | 前端开发   |
| 2    | 李四   | 32   | 后端开发   |
| 3    | 王五   | 25   | UI设计师   |

---

## 代码块示例

下面是一个简单的 React 组件示例：


\`\`\`tsx
import React, { useState } from 'react';

interface CounterProps {
  initialValue?: number;
}

const Counter: React.FC<CounterProps> = ({ initialValue = 0 }) => {
  const [count, setCount] = useState(initialValue);

  return (
    <div>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
    </div>
  );
};

export default Counter;
\`\`\`

`
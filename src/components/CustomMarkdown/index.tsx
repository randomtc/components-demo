// import { thinkToBlockquote } from '@/utils';
import React, { useCallback, useMemo } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import './markdown.css';
export const thinkToBlockquote = (input: string) => {
  if (!input.includes('<think>') && !input.includes('</think>')) {
    return input;
  }
  // 如果包含标签，执行替换操作
  const output = input
    .replace(/<think>/g, '<blockquote>') // 替换 <think> 为 <blockquote>
    .replace(/<\/think>/g, '</blockquote>'); // 替换 </think> 为 </blockquote>

  return output;
};
const CustomMarkdown = ({ content }: any) => {
  const memoizedContent = useMemo(() => thinkToBlockquote(content), [content]);

  // 使用 useCallback 缓存代码块处理函数
  const renderCodeBlock = useCallback(
    ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      if (!inline && match) {
        return (
          <SyntaxHighlighter
            style={materialDark}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        );
      }
      // inline 或没有匹配的语言时，渲染普通 <code>
      return <code className={className} {...props}>{children}</code>;
    },
    [],
  );


  return (
    <div className="markdown-body">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code: renderCodeBlock, // 使用缓存的函数
        }}
      >
        {memoizedContent}
      </Markdown>
    </div>
  );
};

export default CustomMarkdown;
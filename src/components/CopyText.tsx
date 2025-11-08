import React from 'react';
import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { message } from 'antd';

interface CopyTextProps {
  /** 显示的内容，可以是字符串或 React 节点 */
  content: React.ReactNode;
  /** 复制时的文本，默认取 content（若是字符串） */
  copyText?: string;
  /** 点击图标后跳转的链接 */
  link?: string;
  /** 外部样式 */
  className?: string;
  style?: React.CSSProperties;
  /** 复制成功后的回调 */
  onCopySuccess?: (copiedText: string) => void;
}

/**
 * 复制文本到剪贴板
 * @param text 待复制文本
 */
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // 旧浏览器回退方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed'; // 避免滚动影响
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    return true;
  } catch (err) {
    console.error('复制失败:', err);
    return false;
  }
};

const CopyText: React.FC<CopyTextProps> = ({
  content,
  copyText,
  link,
  className,
  style,
  onCopySuccess,
}) => {
  const handleCopy = async () => {
    const text = copyText ?? (typeof content === 'string' ? content : '');
    if (!text) {
      message.warning('没有可复制的内容');
      return;
    }

    const success = await copyToClipboard(text);
    if (success) {
      message.success('复制成功');
      onCopySuccess?.(text);
    } else {
      message.error('复制失败，请手动选择内容');
    }
  };

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', ...style }}
    >
      <div>{content}</div>
      <div style={{ marginLeft: 4, display: 'flex', alignItems: 'center' }}>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="复制文本"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            margin: 0,
            color: "#1677ff",
          }}
        >
          <CopyOutlined />
        </button>
        {link && (
          <button
            type="button"
            aria-label="打开链接"
            onClick={() => window.open(link, '_blank')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginLeft: 8,

            }}
          >
            <LinkOutlined />
          </button>
        )}
      </div>
    </div>
  );
};

export default CopyText;

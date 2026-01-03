
import { Button } from '@alipay/bigfish/antd'
import { CloseOutlined, RedditCircleFilled } from '@ant-design/icons'
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface DraggableButtonProps {
  /** 按钮宽度（px） */
  buttonWidth?: number;
  /** 按钮高度（px） */
  buttonHeight?: number;
  /** 展开内容区域宽度（px） */
  panelWidth?: number | (() => number);
  /** 默认内容区域高度（px）*/
  panelHeight?: number | (() => number);
  content: any;
}

const DraggableButton: React.FC<DraggableButtonProps> = ({
  buttonWidth = 48,
  buttonHeight = 48,
  panelWidth: propsPanelWidth = 500,
  panelHeight: propsPanelHeight = 720,
  content,
}) => {
  const [showPanel, setShowPanel] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // // ================== 面板宽高 ==================
  const { panelHeight, panelWidth } = useMemo(() => {
    const getValue = (val: number | (() => number), fallback: number) => {
      if (typeof val === 'function') return (val as () => number)();
      if (typeof val === 'number') return val;
      return fallback;
    };

    return {
      panelHeight: getValue(propsPanelHeight, 500),
      panelWidth: getValue(propsPanelWidth, 720),
    };
  }, [propsPanelHeight, propsPanelWidth]);

  // ================== 拖拽相关 ==================
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dragOffsetXRef = useRef(0);
  const dragOffsetYRef = useRef(0);
  const stopDragging = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const container = containerRef.current;

    const newX = event.clientX - dragOffsetXRef.current;
    const newY = event.clientY - dragOffsetYRef.current;
    hasMovedRef.current = true;

    const { offsetWidth, offsetHeight } = container;

    const boundedX = Math.max(
      0,
      Math.min(window.innerW idth - offsetWidth, newX),
    );
    const boundedY = Math.max(
      0,
      Math.min(window.innerHeight - offsetHeight, newY),
    );

    // 用 right / bottom 替代 left / top
    const right = window.innerWidth - offsetWidth - boundedX;
    const bottom = window.innerHeight - offsetHeight - boundedY;

    container.style.right = `${right}px`;
    container.style.bottom = `${bottom}px`;
    container.style.left = 'auto';
    container.style.top = 'auto';
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopDragging);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopDragging);
    };
  }, [handleMouseMove, stopDragging]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    isDraggingRef.current = true;
    hasMovedRef.current = false;

    dragOffsetXRef.current = event.clientX - rect.left;
    dragOffsetYRef.current = event.clientY - rect.top;

    event.preventDefault();
  }, []);

  // ================== 展开 / 收起定位计算 ==================

  /** 展开起时保持面板在可视区域内*/
  const expandPanel = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    let currentRight = window.innerWidth - rect.right;
    let currentBottom = window.innerHeight - rect.bottom;

    // 垂直位置：面板全部可见
    if (rect.top < panelHeight) {
      currentBottom = window.innerHeight - panelHeight - buttonHeight;
    }

    // 水平位置：面板全部可见
    if (rect.left < panelWidth) {
      currentRight = window.innerWidth - panelWidth;
    }

    container.style.right = `${currentRight}px`;
    container.style.bottom = `${currentBottom}px`;
    container.style.left = 'auto';
    container.style.top = 'auto';
  }, [panelHeight, panelWidth, buttonWidth]);

  /** 收起时保持按钮位置不变*/
  const collapsePanel = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const currentRight = window.innerWidth - rect.right;
    const currentBottom = window.innerHeight - rect.bottom;

    container.style.right = `${currentRight}px`;
    container.style.bottom = `${currentBottom}px`;
    container.style.left = 'auto';
    container.style.top = 'auto';
  }, []);

  // ================== 点击逻辑 ==================
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      // 如果是拖拽引起的 mouseup，不触发展开/收起
      if (hasMovedRef.current) return;

      if (!showPanel) {
        expandPanel();
      } else {
        collapsePanel();
      }

      setShowPanel((prev) => !prev);
    },
    [showPanel, expandPanel, collapsePanel],
  );

  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      right: 20,
      bottom: 20,
      zIndex: 999,
      height: showPanel ? panelHeight + buttonHeight : buttonHeight,
      width: showPanel ? panelWidth : buttonWidth,
    }),
    [showPanel, panelHeight, buttonHeight, panelWidth, buttonWidth],
  );

  const panelStyle = useMemo<React.CSSProperties>(
    () => ({
      width: showPanel ? panelWidth : 0,
      height: showPanel ? panelHeight : 0,
      opacity: showPanel ? 1 : 0,
      overflow: 'hidden',
      transition: 'opacity 0.5s ease',
    }),
    [showPanel, panelWidth, panelHeight],
  );

  const buttonStyle: React.CSSProperties = {
    height: buttonHeight,
    width: buttonWidth,
    cursor: 'pointer',
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      <div style={panelStyle}>{content}</div>
      <div style={{ textAlign: 'right' }}>
        <Button
          shape="circle"
          type="primary"
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          icon={
            showPanel ? (
              <CloseOutlined />
            ) : (
              <RedditCircleFilled style={{ fontSize: 32 }} />
            )
          }
          style={buttonStyle}
        />
      </div>
    </div>
  );
};

export default DraggableButton;

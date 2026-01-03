import React, { useRef, useState } from 'react'

let isDragging = false;
let hasMoved = false; // 记录本次按下后是否实际移动过

const styles = {
    btnWidth: 100,
    btnHeight: 50,
    divHeight: 720,
    divWidth: 370,
};

const DraggableButton = () => {
    const [showDiv, setShowDiv] = useState(false);
    const contentRef = useRef<any>(null);

    let startX = 0;
    let startY = 0;

    const mouseMove = (e: MouseEvent) => {
        if (isDragging && contentRef.current) {
            const newX = e.clientX - startX;
            const newY = e.clientY - startY;

            // 只要有移动，就认为是拖拽
            hasMoved = true;

            const divWidth = contentRef.current.offsetWidth;
            const divHeight = contentRef.current.offsetHeight;
            const boundedX = Math.max(0, Math.min(window.innerWidth - divWidth, newX));
            const boundedY = Math.max(0, Math.min(window.innerHeight - divHeight, newY));

            contentRef.current.style.left = `${boundedX}px`;
            contentRef.current.style.top = `${boundedY}px`;
        }
    };

    const mouseUp = () => {
        isDragging = false;
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
    };

    const mouseDown = (e: React.MouseEvent) => {
        if (!contentRef.current) return;
        isDragging = true;
        hasMoved = false; // 每次新的按下，重置移动标记

        const rect = contentRef.current.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
    };

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();

        // 如果这一轮按下后鼠标有拖动过，则不当成点击
        if (hasMoved) {
            return;
        }

        if (!contentRef.current) {
            setShowDiv(!showDiv);
            return;
        }

        const rect = contentRef.current.getBoundingClientRect();
        console.log('🚀 ~ handleClick ~ rect:', rect);
        let newTop = rect.top;
        let newLeft = rect.left;

        // 当前是收起 -> 将要展开
        if (!showDiv) {
            if (rect.top < styles.divHeight) {
                newTop = 0;
            } else {
                newTop = rect.top - styles.divHeight;
            }

            if (rect.left < styles.divWidth) {
                newLeft = 0;
            } else {
                newLeft = rect.left - styles.divWidth + styles.btnWidth;
            }
            contentRef.current.style.left = `${newLeft}px`;
            contentRef.current.style.top = `${newTop}px`;
        } else {
            const currentRight = window.innerWidth - rect.right;
            const currentBottom = window.innerHeight - rect.bottom;

            // 折叠后，容器只有按钮大小，按钮右下角跟当前容器右下角重合，所以直接用 right/bottom 定位：
            contentRef.current.style.right = `${currentRight}px`;
            contentRef.current.style.bottom = `${currentBottom}px`;

            // 清除 left/top，避免冲突
            contentRef.current.style.left = 'auto';
            contentRef.current.style.top = 'auto';
        }

        setShowDiv(!showDiv);
    };

    return (
        <div
            ref={contentRef}
            style={{
                position: 'absolute',
                right: '0px',
                bottom: '0px',
                zIndex: 999,
                border: '1px solid red',
                textAlign: 'right',
                height: showDiv ? styles.divHeight + styles.btnHeight : styles.btnHeight,
                width: showDiv ? styles.divWidth : styles.btnWidth,
            }}
        >
            <div
                style={{
                    height: styles.divHeight,
                    width: styles.divWidth,
                    border: '1px solid green',
                    display: showDiv ? '' : 'none',
                }}
            />
            <button
                style={{
                    height: styles.btnHeight,
                    width: styles.btnWidth,
                }}
                onMouseDown={mouseDown}
                onClick={handleClick}
            >
                移动我
            </button>
        </div>
    );
};

export default DraggableButton;
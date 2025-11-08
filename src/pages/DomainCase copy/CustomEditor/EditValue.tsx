import React, { useState, useRef, useEffect } from 'react';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';
interface IProps {
    value: string;
    onEdit: (val: string) => void;
}
const EditValue = (props: IProps) => {
    const { value: propsValue, onEdit } = props;
    const [value, setValue] = useState(propsValue);
    const [inputValue, setInputValue] = useState(value);
    const [edit, seteEit] = useState<boolean>(false);
    const measuringRef = useRef<HTMLSpanElement>(null);
    const [inputWidtn, setInputWidth] = useState<number>(0);
    const [inputWidthVW, setInputWidthVW] = useState<number>(0);
    /**设置Input框宽度，及其文本宽度 */
    const updateWidth = () => {
        const width = (measuringRef.current as HTMLSpanElement).offsetWidth;
        const viewportWidth = document.documentElement.clientWidth;
        const widthVw = (width / viewportWidth) * 100;
        setInputWidth(width);
        setInputWidthVW(widthVw);
    };
    useEffect(() => {
        if (measuringRef.current) {
            updateWidth();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [measuringRef.current]);
    return (
        <div style={{ display: 'inline-block' }}>
            <div style={{ display: 'flex' }}>
                <div>
                    {!edit ? (
                        <span
                            style={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 4,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '24vw',
                                lineHeight: '1.5',
                                maxHeight: '6em',
                            }}
                            ref={measuringRef}
                        >
                            {inputWidthVW > 20 ? (
                                <Tooltip placement="topLeft" title={value} overlayStyle={{ maxWidth: '30vw' }}>
                                    {value}
                                </Tooltip>
                            ) : (
                                value
                            )}
                        </span>
                    ) : (
                        <Input.TextArea
                            rows={inputWidtn > 300 ? 4 : 1}
                            style={{ width: inputWidtn > 300 ? `26vw` : inputWidtn + 40, resize: 'both' }}
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                            }}
                        />
                    )}
                </div>
                <div style={{ marginLeft: 12, color: '#5478FC' }}>
                    {edit && (
                        <div style={{ display: 'flex' }}>
                            <div>
                                <CheckOutlined
                                    onClick={() => {
                                        setValue(inputValue);
                                        onEdit(inputValue);
                                        seteEit(false);
                                    }}
                                />
                            </div>
                            <div style={{ marginLeft: 5 }}>
                                <CloseOutlined
                                    onClick={() => {
                                        seteEit(false);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    {!edit && (
                        <>
                            <EditOutlined
                                onClick={() => {
                                    updateWidth();
                                    seteEit(true);
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditValue;
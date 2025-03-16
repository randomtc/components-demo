/**根据‘xxx.1.yy’来修改对应数据 */
export const modifySubData = (obj: any, path: string, value: string | string[] | boolean) => {
    if (!obj || !path || value === void 0) return;
    // if (!obj || !path || !value) return;
    const modifiedObj = JSON.parse(JSON.stringify(obj));

    const keys = path.split('.');
    let current = modifiedObj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = isNaN(Number(keys[i])) ? keys[i] : Number(keys[i]);
        if (!current[key]) {
            throw new Error(`Property not found: ${keys[i]}`);
        }
        current = current[key];
    }
    //最后一项单拎出来进行赋值操作
    // const finalKey = isNaN(Number(keys.at(-1))) ? keys.at(-1) : Number(keys.at(-1)); 插件端浏览器版本过低不支持at语法
    const finalKey = isNaN(Number(keys[keys.length - 1]))
        ? keys[keys.length - 1]
        : Number(keys[keys.length - 1]);
    current[finalKey!] = value;
    return modifiedObj;
};

const isJSON = (str: any) => {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
};

/** 解析 [fields] 字段中的 JSON 字符串为对象 */
export function convertYamlDatapropertiesToObject(
    originalObject: any,
    rootNode: string,
    fields: string[],
) {
    try {
        const newObj = JSON.parse(JSON.stringify(originalObject)); // 深拷贝对象
        fields.forEach((fieldName) => {
            const fieldValue = newObj[rootNode][fieldName];
            if (typeof fieldValue === 'string') {
                // 只解析有效的 JSON 字符串，如果是 'null' 字符串则保持原样
                if (fieldValue === 'null') {
                    newObj[rootNode][fieldName] = 'null';
                } else {
                    // 只解析有效的 JSON 字符串
                    if (fieldName === 'realYamlData') {
                        newObj[rootNode][fieldName] = fieldValue;
                    } else {
                        newObj[rootNode][fieldName] = isJSON(fieldValue) ? JSON.parse(fieldValue) : fieldValue;
                    }
                }
            }
        });

        return newObj;
    } catch (error) {
        console.error('Failed to process fields:', error);
        return originalObject[rootNode] || {};
    }
}

export const findAllAssertKeys = (fData: any) => {
    // 收集所有满足条件的键
    try {
        const newData = JSON.parse(JSON.stringify(fData));
        const keys: any[] = [];
        const collectKeys = (data: any, prefix = '') => {
            if (Array.isArray(data)) {
                data.forEach((el, index) => {
                    const key = `${prefix}.${index}`;
                    if (typeof el === 'object' && el !== null) {
                        collectKeys(el, key);
                    } else {
                        keys.push(key);
                    }
                });
            } else if (data !== null && typeof data === 'object') {
                Object.keys(data).forEach((key) => {
                    const el = data[key];
                    const fullKey = prefix ? `${prefix}.${key}` : key;
                    if (typeof el === 'object' && el !== null) {
                        collectKeys(el, fullKey);
                    } else {
                        keys.push(fullKey);
                    }
                });
            }
        };

        collectKeys(newData);

        return keys;
    } catch (error) {
        console.error(error);
    }
};


export const deepConvertEmptyArraysToString = (data: any): any => {
    if (Array.isArray(data)) {
        return data.length === 0 ? '[]' : data.map(deepConvertEmptyArraysToString);
    } else if (data !== null && typeof data === 'object') {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, deepConvertEmptyArraysToString(value)]),
        );
    }
    return data;
};

export function compareVersions(versionA: string, versionB: string) {
    // 处理后缀，只取 '-' 前面的部分
    const baseVersionA = versionA.split('-')[0];
    const baseVersionB = versionB.split('-')[0];
    const partsA = baseVersionA.split('.').map(Number);
    const partsB = baseVersionB.split('.').map(Number);

    const maxLength = Math.max(partsA.length, partsB.length);

    // 比较版本号
    for (let i = 0; i < maxLength; i++) {
        const numA = partsA[i] || 0;
        const numB = partsB[i] || 0;

        if (numA > numB) {
            return 'new';
        } else if (numA < numB) {
            return 'old';
        }
    }

    return 'old'; // versionA 和 versionB 相等
}
/**JSONPath（$[0].parameter.order）转为链式结构 */
export const convertFromJsonPath = (arr: string[], selectKeyRootNode: any, rootNode: any) => {
    if (!arr) return [];
    return arr.map((item) => {
        // 去掉开头的 '$'
        let modifiedItem = item.replace(/^\$/, '');
        // 将 '[数字]' 替换为 '.数字'
        modifiedItem = modifiedItem.replace(/\[(\d+)\]/g, '.$1');
        // 如果开头是 '.' 或者 '', 去掉它
        if (modifiedItem.startsWith('.')) {
            modifiedItem = modifiedItem.slice(1);
        }
        return `${selectKeyRootNode ?? rootNode}.${modifiedItem}`;
    });
};

   /**将链式转为JSONPath（$[0].parameter.order）结构 */
   export const convertToDesiredFormat = (arr: string[]) => {
    return arr.map((item) => {
        // 删除第一个点（.）之前的内容
        const modifiedItem = item.replace(/^[^\.]+/, '');
        //将数字以及前边的点（.0）替换为（[0]）
        const modified = modifiedItem.replace(/\.(\d+)/g, '[$1]');
        // 在字符串开始处添加 '$'
        // return `$${modified}`;
        return `$${modified}`;
    });
};
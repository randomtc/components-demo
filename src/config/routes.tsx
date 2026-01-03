import React, { lazy, Suspense } from 'react'
import { useRoutes, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
export type RouterType = {
    path?: string
    index?: boolean
    element?: React.ReactNode
    children?: RouterType[]
    caseSensitive?: boolean
    pover?: boolean
    label?: string
    icon?: any
    component?: React.LazyExoticComponent<any>
}
export const routers: RouterType[] = [
    { path: '', element: <Navigate to="domaincase" /> },
    { path: 'home', component: lazy(() => import('@/pages/Home')) },
    { path: 'domaincase', component: lazy(() => import('@/pages/DomainCase')) },
    { path: 'componentdemo', component: lazy(() => import('@/pages/ComponentDemo')) },
    { path: 'tabledemo', component: lazy(() => import('@/pages/TableDemo')) },
    { path: 'test', component: lazy(() => import('@/pages/Test')) },
    { path: 'draggablebutton', component: lazy(() => import('@/pages/DraggableButton')) },
    {
        path: 'test',
        children: [
            {
                path: 'children',
                label: '员工管理',
                icon: 'icon-staffmanage',
                component: lazy(() => import('@/pages/Test/TestChildren'))
            },

        ]
    },

    // {
    //     path: 'domaincase',
    //     children: [
    //         {
    //             path: 'children',
    //             label: '员工管理',
    //             icon: 'icon-staffmanage',
    //             component: lazy(() => import('@/pages/Test/TestChildren'))
    //         },

    //     ]
    // },

    // {
    //     path: '/401',
    //     component: lazy(() => import('@/components/401'))
    // },
    // {
    //     path: '/404',
    //     component: lazy(() => import('@/components/404'))
    // },
    // {
    //     path: '*',
    //     component: lazy(() => import('@/components/404'))
    // }
]

function dataDispose(arr: RouterType[]) {
    const setElement = (Child: React.LazyExoticComponent<any>) => (
        <Suspense
            fallback={
                <div style={{ width: '100vw', height: '100vh' }}>
                    <Spin tip="页面加载中..." size="large" />
                </div>
            }
        >
            <Child />
        </Suspense>
    )
    const routerArr: RouterType[] = []
    for (let i = 0; i < arr.length; i++) {
        const { element, component, children, icon, label, ...vals } = arr[i]
        routerArr.push({
            ...vals,
            element: element ? element : component && setElement(component),
            children: children && dataDispose(children)
        })
    }
    return routerArr
}
export default function AppRouter() {
    return useRoutes(dataDispose(routers) as any)
}
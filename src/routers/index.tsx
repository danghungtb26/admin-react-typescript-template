// import App from '@app'
import { generateRandomId } from '@commons/id'
// import { type RouteObject, matchPath } from '@tanstack/react-router'

export type DataRouteObject = Omit<{}, 'children'> & {
  id: string
  children?: DataRouteObject[]
  meta?: {
    title?: string
    titleKey?: string
  }
}

export const routers: DataRouteObject[] = [
  // {
  //   id: 'root',
  //   // element: <App />,
  //   children: [
  //     {
  //       id: 'login',
  //       path: 'login',
  //       lazy: async () => {
  //         const { default: Component } = await import('@app/login')
  //         return {
  //           Component,
  //         }
  //       },
  //       meta: {
  //         title: 'Login',
  //       },
  //     },
  //     {
  //       id: 'signed',
  //       path: '',
  //       element: <DashboardLayout />,
  //       children: [
  //         {
  //           id: 'home',
  //           path: 'home',
  //           lazy: async () => {
  //             const { default: Component } = await import('@app/home')
  //             return {
  //               Component,
  //             }
  //           },
  //           meta: {
  //             title: 'Home',
  //             titleKey: 'home',
  //           },
  //         },
  //         {
  //           id: 'dashboard',
  //           path: 'dashboard',
  //           lazy: async () => {
  //             const { default: Component } = await import('@app/dashboard')
  //             return {
  //               Component,
  //             }
  //           },
  //           meta: {
  //             title: 'Dashboard',
  //             titleKey: 'home',
  //           },
  //         },
  //         {
  //           id: 'template',
  //           path: 'template',
  //           meta: {
  //             title: 'Template',
  //             titleKey: 'table.template.title',
  //           },
  //           children: [
  //             {
  //               id: 'table',
  //               path: 'table',
  //               meta: {
  //                 title: 'Table template',
  //                 titleKey: 'table.template.title',
  //               },
  //               children: [
  //                 {
  //                   id: 'root-table',
  //                   path: '',
  //                   lazy: async () => {
  //                     const { default: Component } = await import('@app/template/table')
  //                     return {
  //                       Component,
  //                     }
  //                   },
  //                   meta: {
  //                     title: 'Table template',
  //                     titleKey: 'table.template.title',
  //                   },
  //                 },
  //                 {
  //                   id: 'detail',
  //                   path: ':id',
  //                   lazy: async () => {
  //                     const { default: Component } = await import('@app/template/table')
  //                     return {
  //                       Component,
  //                     }
  //                   },
  //                   meta: {
  //                     title: 'Detail template',
  //                     titleKey: 'table.template.title',
  //                   },
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           id: generateRandomId(),
  //           path: 'profile',
  //           lazy: async () => {
  //             const { default: Component } = await import('@app/profile')
  //             return {
  //               Component,
  //             }
  //           },
  //           meta: {
  //             title: 'Profile',
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
]

type R = {
  id: string
  paths: string[]
  path: string
  meta: DataRouteObject['meta']
  pathString?: string
  parent?: string
}

const getRoutes: (router: DataRouteObject, prePath?: string[]) => R[] = (router, prePath) => {
  const routers = []
  const id = generateRandomId()
  if (router.path) {
    routers.push({
      id,
      paths: (prePath ?? []).concat(router.path ?? '').filter(i => !!i),
      meta: router.meta,
      path: router.path,
    })
  }

  if (router.children?.length) {
    return routers.concat(
      router.children.reduce<R[]>(
        (a, i: DataRouteObject) =>
          a.concat(
            getRoutes(
              i,
              (prePath ?? []).concat(router.path ?? '').filter(i => !!i),
            ).map(i => ({ parent: router.path ? id : undefined, ...i })),
          ),
        [],
      ),
    )
  }

  return routers
}

export const routerArr = routers
  .reduce<R[]>((a, i) => a.concat(getRoutes(i, [])), [])
  .map(i => ({ ...i, pathString: i.paths.join('/') }))

export const findRouter = (pathname: string) => {
  return routerArr.find(i => matchPath(i.pathString, pathname))
}

export const findRouterById = (id: string) => {
  return routerArr.find(i => i.id === id)
}

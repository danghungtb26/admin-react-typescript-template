import { ScopeType, flattenScope } from '@/models/scope'

export enum ACTION {
  ALL = '*',

  CREATE = 'create',

  READ = 'read',

  UPDATE = 'update',

  DELETE = 'delete',
}

export const permission_actions: ACTION[] = [
  ACTION.ALL,
  ACTION.READ,
  ACTION.CREATE,
  ACTION.UPDATE,
  ACTION.DELETE,
]

export enum APP {
  ALL = '*',

  WORKSPACE = 'workspace',

  ORDER = 'order',

  ARTICLE = 'article',

  BANNER = 'banner',

  MORE = 'more',
}

export enum COLLECTION {
  ALL = '*',
  MEMBER = 'member',
  ACCOUNT = 'account',

  PERMISSION = 'permission',
  ROLE = 'role',
  PRODUCT = 'product',
  CATEGORY = 'category',
  FILTER = 'filter',
  ORDER = 'order',
  CUSTOMER = 'customer',
  ARTICLE = 'article',
  BANNER = 'banner',
  DISCOUNT = 'discount',
  VOUCHER = 'voucher',
  CONTACT = 'contact',
  COUPON = 'coupon',
  CATALOG = 'catalog',
}

export const permission_apps: {
  app: APP
  collections: COLLECTION[]
}[] = [
  {
    app: APP.ALL,
    collections: [COLLECTION.ALL],
  },
  {
    app: APP.WORKSPACE,
    collections: [COLLECTION.MEMBER, COLLECTION.PERMISSION, COLLECTION.ROLE],
  },
  {
    app: APP.ORDER,
    collections: [COLLECTION.ORDER],
  },
  {
    app: APP.ARTICLE,
    collections: [COLLECTION.ARTICLE, COLLECTION.CATEGORY, COLLECTION.FILTER],
  },
  {
    app: APP.BANNER,
    collections: [COLLECTION.BANNER, COLLECTION.DISCOUNT, COLLECTION.VOUCHER],
  },
  {
    app: APP.MORE,
    collections: [COLLECTION.ALL],
  },
]

export const scope_defaults = {
  IS_ADMIN: flattenScope('is:admin:*'),
}

export const checkScope = (scopes: ScopeType[], scope: ScopeType) => {
  const find = scopes?.filter(i => {
    return (
      (i?.action === scope?.action || i?.action === ACTION.ALL) &&
      (i?.object === scope?.object || i?.object === COLLECTION.ALL) &&
      (i?.subject === scope?.subject || i?.subject === COLLECTION.ALL)
    )
  })
  const index = find?.findIndex(i => !i.include)
  return index < 0 && !!find.length
}

export const isScope = (scopes: string[], app: APP, collection: COLLECTION) => {
  const scopeMake = scopes?.map(i => {
    const split = i.split(':')
    return {
      action: split[0],
      app: split[1],
      collection: split[2],
    }
  })

  const scope = scopeMake?.find(i => {
    if ((i.app === app || i.app === '*') && (i.collection === collection || i.collection === '*')) {
      return true
    }
  })
  return scope
}

export const isUpdate = (scopes: string[], app: APP, collection: COLLECTION) => {
  const scopeMake = scopes?.map(i => {
    const split = i.split(':')
    return {
      action: split[0],
      app: split[1],
      collection: split[2],
    }
  })

  const update = scopeMake?.find(i => {
    if (
      (i.collection === collection || i.collection === '*') &&
      (i.app === app || i.app === '*') &&
      (i.action === 'UPDATE' || i.action === '*')
    ) {
      return true
    }
  })
  return !!update
}

export const isCreate = (scopes: string[], app: APP, collection: COLLECTION) => {
  const scopeMake = scopes?.map(i => {
    const split = i.split(':')
    return {
      action: split[0],
      app: split[1],
      collection: split[2],
    }
  })

  const create = scopeMake?.find(i => {
    if (
      (i.collection === collection || i.collection === '*') &&
      (i.app === app || i.app === '*') &&
      (i.action === 'CREATE' || i.action === '*')
    ) {
      return true
    }
  })
  return !!create
}

export const isDelete = (scopes: string[], app: APP, collection: COLLECTION) => {
  const scopeMake = scopes?.map(i => {
    const split = i.split(':')
    return {
      action: split[0],
      app: split[1],
      collection: split[2],
    }
  })

  const delete1 = scopeMake?.find(i => {
    if (
      (i.collection === collection || i.collection === '*') &&
      (i.app === app || i.app === '*') &&
      (i.action === 'DELETE' || i.action === '*')
    ) {
      return true
    }
  })
  return !!delete1
}

// export const usePermission = ({ app, collection }: { app: APP; collection: COLLECTION }) => {
//   const { scopes } = useAuthContext()

//   return {
//     create: isCreate(scopes ?? [], app, collection),
//     update: isUpdate(scopes ?? [], app, collection),
//     delete: isDelete(scopes ?? [], app, collection),
//   }
// }

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as RegisterImport } from './routes/register'
import { Route as SidebarLayoutRouteImport } from './routes/_sidebarLayout/route'
import { Route as IndexImport } from './routes/index'
import { Route as SidebarLayoutTopicsImport } from './routes/_sidebarLayout/topics'
import { Route as SidebarLayoutSourcesImport } from './routes/_sidebarLayout/sources'
import { Route as SidebarLayoutPostsImport } from './routes/_sidebarLayout/posts'

// Create/Update Routes

const RegisterRoute = RegisterImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => rootRoute,
} as any)

const SidebarLayoutRouteRoute = SidebarLayoutRouteImport.update({
  id: '/_sidebarLayout',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const SidebarLayoutTopicsRoute = SidebarLayoutTopicsImport.update({
  id: '/topics',
  path: '/topics',
  getParentRoute: () => SidebarLayoutRouteRoute,
} as any)

const SidebarLayoutSourcesRoute = SidebarLayoutSourcesImport.update({
  id: '/sources',
  path: '/sources',
  getParentRoute: () => SidebarLayoutRouteRoute,
} as any)

const SidebarLayoutPostsRoute = SidebarLayoutPostsImport.update({
  id: '/posts',
  path: '/posts',
  getParentRoute: () => SidebarLayoutRouteRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_sidebarLayout': {
      id: '/_sidebarLayout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof SidebarLayoutRouteImport
      parentRoute: typeof rootRoute
    }
    '/register': {
      id: '/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterImport
      parentRoute: typeof rootRoute
    }
    '/_sidebarLayout/posts': {
      id: '/_sidebarLayout/posts'
      path: '/posts'
      fullPath: '/posts'
      preLoaderRoute: typeof SidebarLayoutPostsImport
      parentRoute: typeof SidebarLayoutRouteImport
    }
    '/_sidebarLayout/sources': {
      id: '/_sidebarLayout/sources'
      path: '/sources'
      fullPath: '/sources'
      preLoaderRoute: typeof SidebarLayoutSourcesImport
      parentRoute: typeof SidebarLayoutRouteImport
    }
    '/_sidebarLayout/topics': {
      id: '/_sidebarLayout/topics'
      path: '/topics'
      fullPath: '/topics'
      preLoaderRoute: typeof SidebarLayoutTopicsImport
      parentRoute: typeof SidebarLayoutRouteImport
    }
  }
}

// Create and export the route tree

interface SidebarLayoutRouteRouteChildren {
  SidebarLayoutPostsRoute: typeof SidebarLayoutPostsRoute
  SidebarLayoutSourcesRoute: typeof SidebarLayoutSourcesRoute
  SidebarLayoutTopicsRoute: typeof SidebarLayoutTopicsRoute
}

const SidebarLayoutRouteRouteChildren: SidebarLayoutRouteRouteChildren = {
  SidebarLayoutPostsRoute: SidebarLayoutPostsRoute,
  SidebarLayoutSourcesRoute: SidebarLayoutSourcesRoute,
  SidebarLayoutTopicsRoute: SidebarLayoutTopicsRoute,
}

const SidebarLayoutRouteRouteWithChildren =
  SidebarLayoutRouteRoute._addFileChildren(SidebarLayoutRouteRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof SidebarLayoutRouteRouteWithChildren
  '/register': typeof RegisterRoute
  '/posts': typeof SidebarLayoutPostsRoute
  '/sources': typeof SidebarLayoutSourcesRoute
  '/topics': typeof SidebarLayoutTopicsRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof SidebarLayoutRouteRouteWithChildren
  '/register': typeof RegisterRoute
  '/posts': typeof SidebarLayoutPostsRoute
  '/sources': typeof SidebarLayoutSourcesRoute
  '/topics': typeof SidebarLayoutTopicsRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_sidebarLayout': typeof SidebarLayoutRouteRouteWithChildren
  '/register': typeof RegisterRoute
  '/_sidebarLayout/posts': typeof SidebarLayoutPostsRoute
  '/_sidebarLayout/sources': typeof SidebarLayoutSourcesRoute
  '/_sidebarLayout/topics': typeof SidebarLayoutTopicsRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '' | '/register' | '/posts' | '/sources' | '/topics'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '' | '/register' | '/posts' | '/sources' | '/topics'
  id:
    | '__root__'
    | '/'
    | '/_sidebarLayout'
    | '/register'
    | '/_sidebarLayout/posts'
    | '/_sidebarLayout/sources'
    | '/_sidebarLayout/topics'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  SidebarLayoutRouteRoute: typeof SidebarLayoutRouteRouteWithChildren
  RegisterRoute: typeof RegisterRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  SidebarLayoutRouteRoute: SidebarLayoutRouteRouteWithChildren,
  RegisterRoute: RegisterRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_sidebarLayout",
        "/register"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_sidebarLayout": {
      "filePath": "_sidebarLayout/route.tsx",
      "children": [
        "/_sidebarLayout/posts",
        "/_sidebarLayout/sources",
        "/_sidebarLayout/topics"
      ]
    },
    "/register": {
      "filePath": "register.tsx"
    },
    "/_sidebarLayout/posts": {
      "filePath": "_sidebarLayout/posts.tsx",
      "parent": "/_sidebarLayout"
    },
    "/_sidebarLayout/sources": {
      "filePath": "_sidebarLayout/sources.tsx",
      "parent": "/_sidebarLayout"
    },
    "/_sidebarLayout/topics": {
      "filePath": "_sidebarLayout/topics.tsx",
      "parent": "/_sidebarLayout"
    }
  }
}
ROUTE_MANIFEST_END */

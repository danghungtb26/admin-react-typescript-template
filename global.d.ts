// React Router types have been replaced by TanStack Router
// This file is kept for potential future global type declarations
declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    meta?: {
      title?: string
      titleKey?: string
    }
  }
}

export {}

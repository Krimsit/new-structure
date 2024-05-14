import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'

import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  context: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    auth: undefined!,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Fragment } from 'react'

export const Route = createRootRouteWithContext()({
  component: () => (
    <Fragment>
      <Outlet />
      <TanStackRouterDevtools />
    </Fragment>
  ),
})

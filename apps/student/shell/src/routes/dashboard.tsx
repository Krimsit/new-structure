import { createFileRoute } from '@tanstack/react-router'
import Dashboard from 'student-dashboard/Dashboard'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

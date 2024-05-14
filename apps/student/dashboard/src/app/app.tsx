import { Dashboard } from '@shared/icons'
import { Alerts } from '@shared/icons/altbox'
import { Google } from '@shared/icons/colourful'
import { TShirt } from '@shared/icons/custom'
import { Ru } from '@shared/icons/flags'

export function App() {
  return (
    <div>
      <div style={{ color: 'red' }}>
        <Dashboard />
        <TShirt />
        <Alerts />
        <Google />
        <Ru />
      </div>
      Dashboard
    </div>
  )
}

export default App

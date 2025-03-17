import AppRouter from '@/config/routes'
import { HashRouter,BrowserRouter } from 'react-router-dom'
function App() {
  return (
    <HashRouter>
      <AppRouter />
    </HashRouter>
  )
}

export default App
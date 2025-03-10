import AppRouter from '@/config/routes'
import { HashRouter,BrowserRouter } from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App
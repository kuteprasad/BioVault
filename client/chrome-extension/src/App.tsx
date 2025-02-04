import { AuthProvider } from './context/AuthContext'
import Home from './modules/Home'

function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  )
}

export default App
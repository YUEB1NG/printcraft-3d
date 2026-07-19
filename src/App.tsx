import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import NavBar from './components/NavBar'
import ReliefStudio from './components/ReliefStudio'
import TextStudio from './components/TextStudio'

export default function App() {
  const loc = useLocation()
  return (
    <>
      <NavBar />
      <AnimatePresence mode="wait">
        <Routes location={loc} key={loc.pathname}>
          <Route path="/" element={<ReliefStudio />} />
          <Route path="/zibian" element={<TextStudio />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

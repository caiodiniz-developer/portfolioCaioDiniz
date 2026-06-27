import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import CustomCursor from './components/animations/CustomCursor'
import SmoothScroll from './components/animations/SmoothScroll'
import FloatingShape3D from './components/animations/FloatingShape3D'
import ScrollProgress from './components/animations/ScrollProgress'
import WeatherBackground from './components/animations/WeatherBackground'
import AmbientMode from './components/animations/AmbientMode'
import GravityCursor from './components/animations/GravityCursor'
import CurrentlyWidget from './components/ui/CurrentlyWidget'

export default function App() {
  return (
    <>
      <CustomCursor />
      <SmoothScroll />
      <FloatingShape3D />
      <ScrollProgress />
      <WeatherBackground />
      <AmbientMode />
      <GravityCursor />
      <CurrentlyWidget />
      <RouterProvider router={router} />
    </>
  )
}

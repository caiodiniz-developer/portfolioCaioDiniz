import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import CustomCursor from './components/animations/CustomCursor'
import SmoothScroll from './components/animations/SmoothScroll'
import FloatingShape3D from './components/animations/FloatingShape3D'
import ScrollProgress from './components/animations/ScrollProgress'

export default function App() {
  return (
    <>
      <CustomCursor />
      <SmoothScroll />
      <FloatingShape3D />
      <ScrollProgress />
      <RouterProvider router={router} />
    </>
  )
}

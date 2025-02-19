import { useState } from 'react'
import './App.css'
import DragonIDForm from './DragonIDForm'
import React from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <DragonIDForm />
    </>
  )
}

export default App

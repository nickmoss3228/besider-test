import './App.css'
import Navbar from './components/Navbar'
import News from './components/News'
// import { Provider } from "react-redux"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
           <Route path="/" element={<News />} />
        </Routes>
      </Router>
    </>
  )
}

export default App

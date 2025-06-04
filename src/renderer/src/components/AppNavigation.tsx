import { useState } from 'react'
import { MdRestaurantMenu } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router'

export const AppNavigation = (): React.JSX.Element => {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(!menuOpen)
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <nav id="app-navigation">
      <button className="nav-toggle" onClick={toggleMenu}>
        <MdRestaurantMenu />
      </button>
      <div className={`navigation-container-wrapper ${menuOpen ? 'open' : ''}`}>
        <div className="navigation-container">
          <div
            className={`menu-item ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => {
              navigate('/')
              toggleMenu()
            }}
          >
            Chats
          </div>
          <div
            className={`menu-item ${location.pathname === '/prompt-playground' ? 'active' : ''}`}
            onClick={() => {
              navigate('/prompt-playground')
              toggleMenu()
            }}
          >
            Prompt playground
          </div>
        </div>
      </div>
    </nav>
  )
}

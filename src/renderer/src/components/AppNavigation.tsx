import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'
import { deleteDialog, getDialog, getDialogs } from '@renderer/redux/actions'
import { RootState } from '@renderer/redux/store'
import { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { MdRestaurantMenu } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'

export const AppNavigation = (): React.JSX.Element => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch()
  useEffect(() => dispatch(getDialogs()), [dispatch])

  const dialogs = useSelector((state: RootState) => state.dialogs.dialogs)
  const currentDialogId = useSelector((state: RootState) => state.activeDialog.dialogId)

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
            <div>
              {dialogs.map((d) => (
                <div
                  className={`sub-menu-item ${currentDialogId === d.id ? 'active' : ''}`}
                  key={d.id}
                  onClick={() => {
                    dispatch(getDialog(d.id))
                  }}
                >
                  - {d.title}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch(deleteDialog(d.id))
                    }}
                  >
                    <IoMdClose />
                  </button>
                </div>
              ))}
            </div>
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

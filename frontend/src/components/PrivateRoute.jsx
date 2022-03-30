import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Spinner from './Spinner'

const PrivateRoute = () => {
    const { loggedIn, checkingStatus } = useAuth()

    if(checkingStatus){
        return <Spinner />
    }

    return loggedIn ? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoute
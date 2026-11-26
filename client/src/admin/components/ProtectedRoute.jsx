import { Navigate } from 'react-router-dom'
import { getAuthToken } from '../authSession'

const ProtectedRoute = ({ children }) => {

    const token = getAuthToken()

    if (!token) {
        return <Navigate to="/admin" />
    }

    return children

}

export default ProtectedRoute
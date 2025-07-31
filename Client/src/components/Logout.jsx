import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

const Logout = () => {
    const { logout } = useAuthStore()
    const location = useLocation();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout().then(() => {
            alert('Sign-out successful!!')
            navigate(location.state?.from || '/', { replace: true })
        })
        .catch((error) => {
            console.error('Logout error:', error);
        });
    }
    
    return (
        <div className='h-screen bg-teal-100 flex items-center justify-center'>
            <button className='bg-red-700 px-8 py-2 text-white rounded' onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Logout

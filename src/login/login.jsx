import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

// "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjExMDAiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjExMDAiLCJzdWIiOiI4MDAzIiwianRpIjoiNGZmNGNmNWMtOTZmNi00OGIzLWI3MmMtMWEzNTkzZjgwYjk4IiwibmJmIjoxNzkwOTI0MDE5LCJleHAiOjE3OTA5MjU4MTksImlhdCI6MTc5MDkyNDAxOX0.Dq9os9umnp48tN1-iQInabRJX7eXdwQBa22do_XqRQ8",

const Login = () => {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        handleValidation();
        const response = await axios.post('http://192.168.1.8:1100/api/v1/Auth/login', {
            UserName: userName,
            Password: password
        })

        console.log('resss', response.data);

        if (response.data.success === true) {
            toast.success('Login successful');
            setTimeout(() => {
                navigate('/inventory');
            }, 2000);
        } else {
            toast.error(response.data.error.message);
        }

        localStorage.setItem('token', response.data.data.accessToken)
    }

    const handleValidation = () => {
        if (!userName || !password) {
            toast.error('Please fill in all fields');
            return false;
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f1f1f1', padding: '20px', borderRadius: '10px', width: '30%', justifyContent: 'center', marginTop: '150px', marginLeft: 'auto', marginRight: 'auto' }}>
                <h1>Welcome Back</h1>
                <h3 style={{ color: 'gray' }}>Sign in to continue your session</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <label htmlFor="userName">User Name</label>
                        <input
                            type="text"
                            placeholder="User Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            showPassword={showPassword}
                        />

                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <button onClick={handleSubmit} style={{ width: '160px', backgroundColor: '#1f1abd', marginTop: '20px', color: '#ffffff' }}>Sign In</button>
                    </div>
                    <p>Don't have an account? <Link to="/register" style={{ textDecoration: 'none' }}>Register here</Link></p>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login;
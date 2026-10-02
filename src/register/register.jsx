import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

const Register = () => {
    const [fullName, setFullName] = useState('')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        handleValidation()
        const response = await axios.post('http://192.168.1.8:1100/api/v1/Auth/register', {
            FullName: fullName,
            UserName: userName,
            Email: email,
            Password: password
        })
    
        if(response.data.success === true){
            toast.success(response.data.message)
            setTimeout(() => {
                navigate('/login')
            }, 1000);
        }
    }

    const handleValidation = () => {
        if (!fullName || !userName || !email || !password) {
            toast.error('Please fill in all fields');
            return false;
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f1f1f1', padding: '20px', borderRadius: '10px', width: '30%', justifyContent: 'center', marginTop: '150px', marginLeft: 'auto', marginRight: 'auto' }}>
                <h1>Create Account</h1>
                <h3>Join us for a premium experience</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
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
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    <button onClick={handleSubmit} style={{ backgroundColor: '#1f1abd', width: '160px', marginTop: '20px', color: '#ffffff' }}>Register</button>
                </div>
                <p>Already have an account? <Link to="/login" style={{ textDecoration: 'none' }}>Login here</Link></p>
            </div>
            <ToastContainer />
        </div >
    )
}

export default Register
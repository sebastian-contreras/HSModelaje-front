import { useState } from 'react'
import { Alert, Form } from 'react-bootstrap'
import { Navigate, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../../context/Auth/AuthContext'
import { login } from '../../services/LoginService'
import Button from '../../components/Button/Button'

function Login () {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [codigo2fa, setCodigo2fa] = useState('')
  const [loading, setLoading] = useState(false)
  const { token, setToken, user, setUser, login: loginState } = useAuth()
  const navigate = useNavigate()
  const [errors, setErrors] = useState({}) // State to store validation errors
  const [badCredentials, setBadCredentials] = useState(null) // State to store validation errors

  const handleSubmit = async event => {
    event.preventDefault()
    setLoading(true)

    await login(usuario, contrasena, codigo2fa)
      .then(response => {
        console.log('skdjfksdjfdskj')
        console.log(response.data.token)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user));
        loginState(response.data.user)
        Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: toast => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        // navigate('/') // Redirige a /servicios
        console.log(response)
      })
      .catch(error => {
        setBadCredentials('Credenciales invalidas')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return !token ? (
    <>
      <section
        className=' gradient-form ctn-general-login'
        style={{ backgroundColor: '#eee', height: '100vh' }}
      >
        <div className='container py-5 ' style={{ width: '35%' }}>
          <div className='row d-flex justify-content-center align-items-center '>
            <div className='card rounded-3 text-black'>
              <div className='row g-0'>
                <div className='card-body p-md-5 mx-md-4'>
                  <div className='text-center'>
                    <img
                      src='/img/logo/logo_light.png'
                      alt=''
                      className='logo-login'
                    />
                    <h4 className='mb-3'>Inicio de sesion</h4>
                    <h5 className='mb-5 pb-1 fw-light'>
                      Ingrese sus credenciales para iniciar sesión
                    </h5>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div data-mdb-input-init className='form-outline mb-2'>
                      <label className='form-label fw-semibold mt-1 ms-1'>
                        Direccion de email
                      </label>
                      <Form.Control
                        type='email'
                        value={usuario}
                        onChange={e => {
                          setUsuario(e.target.value)
                          setBadCredentials(false)
                        }}
                        className={`form-control`}
                        // placeholder=" "
                      />
                    </div>
                    {errors.usuario && (
                      <div className='invalid-feedback'>{errors.usuario}</div>
                    )}

                    <div data-mdb-input-init className='form-outline mb-2'>
                      <label className='form-label fw-semibold mt-1 ms-1'>
                        Contraseña
                      </label>
                      <Form.Control
                        type='password'
                        value={contrasena}
                        onChange={e => {
                          setContrasena(e.target.value)
                          setBadCredentials(false)
                        }}
                        className='form-control'
                      />
                    </div>

                   
                    <Alert
                      show={badCredentials}
                      className='text-center'
                      variant='danger'
                    >
                      {badCredentials}
                    </Alert>
                    <div className='text-center pt-1 mb-1 pb-1'>
                      <Button
                        lg
                        type='submit'
                        estilo='secondary'
                        style={{ width: '55%' }}
                      >
                        {loading ? 'Enviando...' : 'Iniciar'}
                      </Button>
                    </div>
                  </form>
                  <div
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <p className='btn-text mt-3'>¿Olvidaste tu contraseña?</p>
                    <p className='btn-text mt-3'>¿Olvidaste tu usuario?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  ) : (
    
    <Navigate to='/personas' replace={true} />
  )
}

export default Login

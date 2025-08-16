import { useState } from 'react'
import { Alert, Form } from 'react-bootstrap'
import { Navigate, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../../context/Auth/AuthContext'
import { login } from '../../services/LoginService'
import Button from '../../components/Button/Button'

function Login () {
  const { logout } = useAuth()
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [UsuarioEstado, setUsuarioEstado] = useState(null)
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
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        setUsuarioEstado(response.data.user)
        console.log(response.data.user)
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
        console.log(response)
      })
      .catch(error => {
        setBadCredentials('Credenciales inválidas')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return !token ? (
    <>
      <section className="gradient-form ctn-general-login" style={{ backgroundColor: '#eee', minHeight: '100vh' }}>
        <div className="container py-3 py-md-5">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">
              <div className="card rounded-3 text-black"
             style={{
              backgroundColor: '#f4f3fd',
               overflow: 'hidden' // 👈 esto fuerza que el contenido respete los bordes redondeados
            }}
              >
                <div className="card-body p-3 p-md-4 p-lg-5 mx-md-4">
                  <div className="text-center">
                    <img
                      src='/logos-web/logo-color-completo.png' 
                      alt=''
                      style={{ maxWidth: '250px', height: 'auto' }}
                      className='img-fluid mb-3'
                    />
                    <h4 className='mb-3'>Inicio de sesión</h4>
                    <h5 className='mb-4 mb-md-5 pb-1 fw-light'>
                      Ingrese sus credenciales para iniciar sesión
                    </h5>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className='form-outline mb-3'>
                      <label className='form-label fw-semibold mt-1 ms-1'>
                        Dirección de email
                      </label>
                      <Form.Control
                        type='email'
                        value={usuario}
                        onChange={e => {
                          setUsuario(e.target.value)
                          setBadCredentials(false)
                        }}
                        className={`form-control`}
                      />
                    </div>
                    {errors.usuario && (
                      <div className='invalid-feedback'>{errors.usuario}</div>
                    )}

                    <div className='form-outline mb-3'>
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
                    <div className='text-center pt-5 mb-3 pb-1'>
                      <Button
                        lg
                        type='submit'
                        estilo='secondary'
                        className='w-100 w-md-55'
                      >
                        {loading ? 'Enviando...' : 'Iniciar'}
                      </Button>
                    </div>
                  </form>
               
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  ) : UsuarioEstado?.role == 'A' || UsuarioEstado?.role == 'M' ? (
    <Navigate to='/eventos' replace={true} />
  ) : UsuarioEstado?.role == 'G' ? (
    <Navigate to='/guardia' replace={true} />
  ) : (
    logout()
  )
}

export default Login
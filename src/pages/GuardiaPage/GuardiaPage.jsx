import {
  faCamera,
  faCheck,
  faClock,
  faCopy,
  faExternalLinkAlt,
  faFileAlt,
  faLink,
  faRedo,
  faSignOutAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Html5Qrcode } from 'html5-qrcode'
import { useEffect, useState } from 'react'
import {
  Alert,
  Container,
  Button as RBButton,
  Card as RBCard,
  Spinner
} from 'react-bootstrap'
import Button from '../../components/Button/Button'
import { useAuth } from '../../context/Auth/AuthContext'
import {
  dameEntradaTokenApi,
  usarEntradaApi
} from '../../services/EntradasService'
import { Alerta } from '../../functions/alerts'
import { MENSAJE_DEFAULT } from '../../Fixes/messages'

export default function GuardiaPage () {
  const [scanner, setScanner] = useState(null)
  const [isStarted, setIsStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const { token, user, logout } = useAuth()

  useEffect(() => {
    return () => {
      if (scanner && scanner.isScanning) {
        scanner.stop().catch(console.error)
      }
    }
  }, [scanner])

  const startScanner = async () => {
    try {
      setIsLoading(true)
      const html5QrCode = new Html5Qrcode('reader')
      setScanner(html5QrCode)

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 30,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          disableFlip: true
        },
        decodedText => {
          stopScanner()
          console.log(decodedText)
          dameEntradaTokenApi(decodedText)
            .then(res => {
              console.log(res)
              usarEntradaApi(res.data[0].IdEntrada)
                .then(res => {
                  console.log(res)
                })
                .catch(err => {
                  Alerta()
                    .withMini(true)
                    .withTipo('error')
                    .withTitulo('Error al usar la entrada')
                    .withMensaje(
                      err?.response?.data?.message
                        ? err.response.data.message
                        : MENSAJE_DEFAULT
                    )
                })
                .finally(() => {
                  setResult(res.data[0])
                })
            })
            .catch(err => {
              Alerta()
                .withMini(true)
                .withTipo('error')
                .withTitulo('Error al obtener la entrada')
                .withMensaje(
                  err?.response?.data?.message
                    ? err.response.data.message
                    : MENSAJE_DEFAULT
                )
            })
        }
      )

      setIsStarted(true)
      setPermissionDenied(false)
    } catch (err) {
      console.error('Error:', err)
      setPermissionDenied(true)
    } finally {
      setIsLoading(false)
    }
  }

  const stopScanner = () => {
    if (scanner && scanner.isScanning) {
      scanner.stop().catch(console.error)
    }
    setIsStarted(false)
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isURL = text => {
    try {
      new URL(text)
      return true
    } catch {
      return false
    }
  }

  const handleReset = async () => {
    if (scanner && scanner.isScanning) {
      await scanner.stop().catch(console.error)
    }

    setIsStarted(false)
    setResult(null)
  }

  useEffect(() => {
    if (result === null && !isStarted && !isLoading) {
      const timeout = setTimeout(() => {
        startScanner()
      }, 300)

      return () => clearTimeout(timeout)
    }
  }, [result, isStarted, isLoading]) // <- agregá estas dependencias

  return (
    <Container className=''>
      {/* Header */}
      <div className='d-flex w-100 justify-content-between align-items-center mb-4 p-3 bg-white border rounded shadow-sm'>
        <div className='d-flex align-items-center gap-2'>
          <div
            className='bg-primary rounded-circle d-flex justify-content-center align-items-center'
            style={{ width: 44, height: 44 }}
          >
            <FontAwesomeIcon icon={faUser} className='text-white' />
          </div>
          <div>
            <strong className='d-block'>{user?.name}</strong>
          </div>
        </div>
        <Button
          estilo='danger'
          sm
          className='d-block '
          onClick={logout}
          size='sm'
        >
          <FontAwesomeIcon icon={faSignOutAlt} className='me-1' />
          <span className='d-sm-inline'>Cerrar</span>
        </Button>
      </div>

      {/* Escáner o resultado */}
      {!result ? (
        <RBCard className='shadow-sm border-0 mb-3'>
          <RBCard.Header className='text-center fw-bold'>
            Escanear Código QR
          </RBCard.Header>
          <RBCard.Body className='text-center'>
            <div
              id='reader'
              style={{
                width: '100%',
                maxWidth: 320,
                aspectRatio: 1,
                margin: '0 auto',
                border: isStarted ? '2px solid #198754' : '2px dashed #ccc',
                borderRadius: 10,
                backgroundColor: '#f8f9fa'
              }}
            />
            {permissionDenied && (
              <Alert variant='danger' className='mt-3'>
                No se pudo acceder a la cámara. Revisa los permisos.
              </Alert>
            )}
          </RBCard.Body>
          <RBCard.Footer className='text-center'>
            <Button
              onClick={isStarted ? stopScanner : startScanner}
              disabled={isLoading}
              lg
              variant={isStarted ? 'danger' : 'success'}
              size='lg'
              className='w-100'
            >
              {isLoading ? (
                <>
                  <Spinner size='sm' animation='border' className='me-2' />
                  Iniciando...
                </>
              ) : isStarted ? (
                <>
                  <FontAwesomeIcon icon={faCamera} className='me-2' /> Detener
                  Escáner
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCamera} className='me-2' /> Iniciar
                  Escáner
                </>
              )}
            </Button>
          </RBCard.Footer>
        </RBCard>
      ) : (
        <RBCard className='shadow-sm border-0 mb-3'>
          <RBCard.Header className='text-center fw-bold'>
            Resultado del Escaneo
          </RBCard.Header>
          <RBCard.Body>
            <small className='text-muted'>
              <FontAwesomeIcon icon={faFileAlt} className='me-1' />
              Entrada detectada:
            </small>
            <div
              className='bg-light p-3 rounded'
              style={{ wordBreak: 'break-word' }}
            >
              {/* {result} */}
              <p>DNI: {result?.DNI}</p>
              <p>Nombre: {result?.ApelName}</p>
              <p>Cantidad: {result?.Cantidad}</p>
              <p>Estado: {result?.EstadoEnt}</p>
            </div>
            {result?.EstadoEnt == 'A' ? (
              <Alert variant='success' className='mt-3'>
                <Alert.Heading>Entrada Valida</Alert.Heading>
                <p>La entrada es valida y fue registrada exitosamente.</p>
              </Alert>
            ) : (
              ''
            )}
            {result?.EstadoEnt == 'U' ? (
              <Alert variant='warning' className='mt-3'>
                <Alert.Heading>
                  La entrada ya fue marcada como utilizada
                </Alert.Heading>
              </Alert>
            ) : (
              ''
            )}
          </RBCard.Body>
          <RBCard.Footer>
            <Button
              estilo='success'
              lg
              onClick={handleReset}
              className='w-100'
              size='lg'
            >
              <FontAwesomeIcon icon={faRedo} className='me-2' />
              Escanear Otro Código
            </Button>
          </RBCard.Footer>
        </RBCard>
      )}
    </Container>
  )
}

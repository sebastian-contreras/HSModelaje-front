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
    faUser,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Html5Qrcode } from "html5-qrcode"
import { useEffect, useState } from "react"
import {
    Alert,
    Container,
    Button as RBButton,
    Card as RBCard,
    Spinner
} from "react-bootstrap"
import Button from "../../components/Button/Button"

export default function GuardiaPage() {
  const [scanner, setScanner] = useState(null)
  const [isStarted, setIsStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

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
      const html5QrCode = new Html5Qrcode("reader")
      setScanner(html5QrCode)

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 30,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          disableFlip: true,
        },
        (decodedText) => {
        //   stopScanner()
          setResult(decodedText)
        }
      )

      setIsStarted(true)
      setPermissionDenied(false)
    } catch (err) {
      console.error("Error:", err)
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

  const isURL = (text) => {
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
    <Container className="">
      {/* Header */}
      <div className="d-flex w-100 justify-content-between align-items-center mb-4 p-3 bg-white border rounded shadow-sm">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary rounded-circle d-flex justify-content-center align-items-center" style={{ width: 44, height: 44 }}>
            <FontAwesomeIcon icon={faUser} className="text-white" />
          </div>
          <div>
            <strong className="d-block">Juan Pérez</strong>
          </div>
        </div>
          <Button estilo="danger" sm className="d-block " size="sm">
            <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
            <span className="d-sm-inline">Cerrar</span>
          </Button>
      </div>

      {/* Escáner o resultado */}
      {!result ? (
        <RBCard className="shadow-sm border-0 mb-3">
          <RBCard.Header className="text-center fw-bold">Escanear Código QR</RBCard.Header>
          <RBCard.Body className="text-center">
            <div
              id="reader"
              style={{
                width: "100%",
                maxWidth: 320,
                aspectRatio: 1,
                margin: "0 auto",
                border: isStarted ? "2px solid #198754" : "2px dashed #ccc",
                borderRadius: 10,
                backgroundColor: "#f8f9fa",
              }}
            />
            {permissionDenied && (
              <Alert variant="danger" className="mt-3">
                No se pudo acceder a la cámara. Revisa los permisos.
              </Alert>
            )}
          </RBCard.Body>
          <RBCard.Footer className="text-center">
            <Button
              onClick={isStarted ? stopScanner : startScanner}
              disabled={isLoading}
              lg
              variant={isStarted ? "danger" : "success"}
              size="lg"
              className="w-100"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Iniciando...
                </>
              ) : isStarted ? (
                <>
                  <FontAwesomeIcon icon={faCamera} className="me-2" /> Detener Escáner
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCamera} className="me-2" /> Iniciar Escáner
                </>
              )}
            </Button>
          </RBCard.Footer>
        </RBCard>
      ) : (
        <RBCard className="shadow-sm border-0 mb-3">
          <RBCard.Header className="text-center fw-bold">Resultado del Escaneo</RBCard.Header>
          <RBCard.Body>
            {isURL(result) ? (
              <>
                <small className="text-muted">
                  <FontAwesomeIcon icon={faLink} className="me-1" />
                  Enlace detectado:
                </small>
                <div className="bg-light p-3 rounded mb-3" style={{ wordBreak: "break-word" }}>
                  {result}
                </div>
                <Button variant="outline-secondary" onClick={handleCopy} className="mb-2 w-100">
                  <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="me-2" />
                  {copied ? "Copiado" : "Copiar Enlace"}
                </Button>
                <Button variant="primary" onClick={() => window.open(result, "_blank")} className="w-100">
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="me-2" />
                  Abrir Enlace
                </Button>
              </>
            ) : (
              <>
                <small className="text-muted">
                  <FontAwesomeIcon icon={faFileAlt} className="me-1" />
                  Texto detectado:
                </small>
                <div className="bg-light p-3 rounded" style={{ wordBreak: "break-word" }}>
                  {result}
                </div>
              </>
            )}
          </RBCard.Body>
          <RBCard.Footer>
            <Button estilo="success" lg onClick={handleReset} className="w-100" size="lg">
              <FontAwesomeIcon icon={faRedo} className="me-2" />
              Escanear Otro Código
            </Button>
          </RBCard.Footer>
        </RBCard>
      )}
    </Container>
  )
}

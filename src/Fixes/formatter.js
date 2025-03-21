import dayjs from 'dayjs'

export const formatearFechayHora = fecha => {
  return dayjs(fecha).format('DD/MM/YYYY HH:mm')
}

export const formatearMoneda = monto => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'ARS',
  }).format(monto)
}
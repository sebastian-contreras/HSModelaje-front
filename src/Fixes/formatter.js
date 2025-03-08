import dayjs from 'dayjs'

export const formatearFechayHora = fecha => {
  return dayjs(fecha).format('DD/MM/YYYY HH:mm')
}

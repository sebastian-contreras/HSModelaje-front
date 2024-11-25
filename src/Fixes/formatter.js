import dayjs from 'dayjs'

export const formatearFechayHora = fecha => {
  return dayjs(fecha).format('YYYY-MM-DD HH:mm')
}

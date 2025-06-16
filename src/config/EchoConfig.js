import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

export const echo = (window.Echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_KEY,
  wsHost: import.meta.env.VITE_WS_HOST,
  wsPort: import.meta.env.VITE_WS_PORT,
  wssPort: import.meta.env.VITE_WS_PORT,
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  cluster: 'mt1'
}))

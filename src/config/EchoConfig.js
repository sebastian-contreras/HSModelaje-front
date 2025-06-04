import Echo from "laravel-echo"
import Pusher from "pusher-js"

window.Pusher = Pusher

export const echo = (window.Echo = new Echo({
  broadcaster: 'pusher',
  key: 'eq6doihjm8dcke8g263o',
  wsHost: '127.0.0.1',
  wsPort: 8080,
  wssPort: 8080,
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  cluster: 'mt1'
}))
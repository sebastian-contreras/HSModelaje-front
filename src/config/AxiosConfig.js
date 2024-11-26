// axiosConfig.js
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// Puedes agregar más configuraciones aquí si es necesario

export default axios;
# Etapa de build
FROM node:23 as build
WORKDIR /app

# Copia los archivos del proyecto, incluyendo el .env (aunque lo sobrescribiremos)
COPY . .

# Instala las dependencias
RUN npm install

# Declara un argumento de build para la URL de la API
ARG VITE_API_URL
ARG VITE_WS_HOST
ARG VITE_WS_PORT    
ARG VITE_PUSHER_KEY

# Compila la aplicación, pasando la variable de entorno VITE_API_URL
# de forma explícita para que se use en la compilación
RUN VITE_API_URL=$VITE_API_URL VITE_WS_HOST=$VITE_WS_HOST VITE_WS_PORT=$VITE_WS_PORT VITE_PUSHER_KEY=$VITE_PUSHER_KEY npm run build

# Etapa de producción
FROM nginx:alpine

# Copia los archivos estáticos compilados
COPY --from=build /app/dist /usr/share/nginx/html

# Copia la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 del servidor web
EXPOSE 80
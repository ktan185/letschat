import { createProxyMiddleware } from 'http-proxy-middleware'

// This function allows use to proxy to our backend server; eliminating
// the need to build our static files during development.
export default function (app) {
  app.use(
    '/chat',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      ws: true,
    })
  )
}

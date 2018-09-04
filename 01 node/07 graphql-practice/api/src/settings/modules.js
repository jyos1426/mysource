import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

export default function (server) {
  server.use(cors())

  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({extended: false}))

  server.use(cookieParser())
  server.use(morgan('tiny'))
}
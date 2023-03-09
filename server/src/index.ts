import {startupServer} from './server'
import {connectMongoDb} from "./db"

connectMongoDb() 
startupServer()
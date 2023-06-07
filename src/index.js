import { Hono } from 'hono'
import matchToday from '../db/matchToday.json'

const app = new Hono()

app.get('/', (ctx) => {
	return ctx.json([{
		endpoint: '/matchs',
		description: 'Return info of matchs today'
	}])
})

app.get('/matchs', (ctx) => {
	return ctx.json(matchToday)
})

export default app
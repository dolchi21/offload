
import { offload } from '.'

test('Memory eat', async () => {
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    const T = async (arg0: string) => {
        const arr = []
        while (1000 < arr.length) {
            arr.push(Date.now())
        }
        await sleep(1000 * 5)
        return true
    }
    const worker = await offload(T)
    const i = setInterval(() => {
        console.log(Date.now(), 'running', worker.process.connected)
    }, 1000)
    await worker('asd').catch(err => true)
    worker.exit()
}, 1000 * 60 * 60)

test.only('Stress', async () => {
    const T = async () => {
        const axios = require('axios')
        const res = await axios.get('https://lb.cobranzas.com/')
        return res.data
    }
    const tasks = new Array(100).fill(0).map(async (e, i) => {
        const fn = await offload(T)
        const html = await fn()
        //fn.exit()
        return html
    })
    await Promise.all(tasks)
}, 1000 * 60)
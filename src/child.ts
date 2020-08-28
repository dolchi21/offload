import { EXEC, MAIN, EXIT, RESPONSE } from './childActions'

function send(data: any) {
    if (process.send) process.send(data)
}
async function log(data: any) {
    send({ type: 'LOG', payload: data })
}

log({ type: 'init', pid: process.pid })
let main: any = async () => null

function executeMain(args: any) {
    try {
        return Promise.resolve(main(args))
    } catch (err) {
        return Promise.reject(err)
    }
}

process.on('message', async data => {
    switch (data.type) {
        case 'ECHO': {
            return send({ type: 'ECHO', payload: data })
        }
        case EXEC: {
            const { uuid } = data
            return executeMain(data.payload).then((payload: any) => {
                send({ type: RESPONSE, payload, uuid })
            }).catch(err => {
                const error: any = {
                    name: err.name,
                    message: err.message,
                    stack: err.stack,
                }
                send({ type: 'ERROR', payload: error, uuid })
            })
        }
        case EXIT: {
            return process.exit(0)
        }
        case MAIN: {
            const { uuid } = data
            main = eval(data.payload)
            return send({ type: RESPONSE, uuid })
        }
    }
})

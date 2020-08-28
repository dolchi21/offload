import { fork } from 'child_process'
import * as events from 'events'

export function offload(fn: any) {
    const ee = new events.EventEmitter()
    const state = {
        main: fn.toString(),
        startedAt: Date.now()
    }
    const childJS = __dirname + '/child'
    const cp = fork(childJS)
    cp.on('message', (data: any) => {
        const { type, payload, uuid } = data
        switch (type) {
            case 'ERROR': {
                const err = new Error()
                err.name = payload.name
                err.message = payload.message
                err.stack = payload.stack
                return ee.emit('error:' + uuid, err)
            }
            case 'RESULT': return ee.emit('response:' + uuid, payload)
        }
        console.log('child', payload)
    })
    cp.send({ type: 'MAIN', payload: state.main })
    return (data: any) => new Promise((resolve, reject) => {
        try {
            const uuid = [state.startedAt, Date.now()].join('/')
            ee.once('response:' + uuid, data => resolve(data))
            ee.once('error:' + uuid, data => reject(data))
            cp.send({ type: 'EXEC', payload: data, uuid })
        } catch (err) {
            reject(err)
        }
    })
}

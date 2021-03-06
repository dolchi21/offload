import { fork, ChildProcess } from 'child_process'
import * as events from 'events'

import { exec, setMain, Action, exit, RESPONSE } from './childActions'

function send(process: ChildProcess, action: Action) {
    const ee = new events.EventEmitter()
    const onMessage = (data: any) => {
        const { type, payload, uuid } = data
        switch (type) {
            case 'ERROR': {
                const err = new Error()
                err.name = payload.name
                err.message = payload.message
                err.stack = payload.stack
                return ee.emit('ERROR:' + uuid, err)
            }
            case RESPONSE: {
                if (payload && payload.type && payload.type === 'Buffer' && Array.isArray(payload.data)) {
                    return ee.emit('RESPONSE:' + uuid, Buffer.from(payload))
                }
                return ee.emit('RESPONSE:' + uuid, payload)
            }
        }
    }
    process.on('message', onMessage)
    const p = new Promise((resolve, reject) => {
        ee.once('RESPONSE:' + action.uuid, data => resolve(data))
        ee.once('ERROR:' + action.uuid, err => reject(err))
        process.send(action, err => {
            if (err) return reject(err)
        })
    })
    p.catch(err => null).then(() => {
        process.removeListener('message', onMessage)
    })
    return p
}

export async function offload(fn: any, options?: any) {
    const state = {
        closed: false
    }
    const childJS = __dirname + '/child'
    const cp = fork(childJS)
    cp.on('message', (data: any) => {
        const { type, payload, uuid } = data
        switch (type) {
            case 'LOG': {
                if (options && options.logging) return options.logging(payload)
            }
        }
    })
    await send(cp, setMain(fn))
    const caller = (data: any) => {
        if (state.closed) throw new Error('ProcessClosed')
        const action = exec(data)
        return send(cp, action)
    }
    caller.process = cp
    caller.exit = () => {
        state.closed = true
        send(cp, exit())
    }
    return caller
}

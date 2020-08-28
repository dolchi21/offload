import fs from 'fs'

async function log(data: any) {
    const str = JSON.stringify(data)
    fs.appendFileSync('child.log', [new Date().toISOString(), str, '\n'].join('|'))
}

function send(data: any) {
    if (process.send) process.send(data)
}

fs.unlinkSync('child.log')
log({ type: 'init' })
let main: any = async () => null

process.on('message', async data => {
    log({ type: 'message', data })
    switch (data.type) {
        case 'ECHO': {
            return send({ type: 'ECHO', payload: data })
        }
        case 'EXEC': {
            const { uuid } = data
            return Promise.resolve(main(data.payload)).then((payload: any) => {
                send({ type: 'RESULT', payload, uuid })
                process.exit(0)
            }).catch(err => {
                const error: any = {
                    name: err.name,
                    message: err.message,
                    stack: err.stack,
                }
                send({ type: 'ERROR', payload: error, uuid })
                process.exit(1)
            })
        }
        case 'MAIN': {
            const fn = eval(data.payload)
            main = fn
            return
        }
    }
})

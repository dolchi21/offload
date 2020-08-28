import * as uuid from 'uuid'
import { offload } from './'

async function main() {
    const worker = await offload((data: string) => {
        const fs = require('fs')
        fs.writeFileSync('worker.log', [Date.now(), JSON.stringify(data)].join('|'))
        return data
    })
    const ret0 = await worker(uuid.v4())
    console.log(ret0)
    await worker.exit()
    const ret1 = await worker(uuid.v4())
    console.log(ret1)
}

main().catch(err => {
    console.log(err)
})
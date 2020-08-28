import { offload } from './'

async function main() {
    const worker = offload(async (data: string) => {
        const fs = require('fs')
        fs.writeFileSync('worker.log', [Date.now(), JSON.stringify(data)].join('|'))
        throw new Error('Unknown')
        return data.split('')
    })
    const ret = await worker('asd2' + Date.now()).catch(err => {
        console.log(err)
    })
    const ret2 = await worker('asd2' + Date.now()).catch(err=>{
        console.log(err)
    })
    console.log(JSON.stringify({ ret, ret2 }))
}

main()
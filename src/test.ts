import * as Tasks from './test.tasks'
import { offload } from './'

async function main() {
    console.log('master.pid', process.pid)
    const worker = await offload(Tasks.task0)
    const tasks = [
        'https://google.com',
        'https://facebook.com'
    ].map(url => worker(url))
    const ret = await Promise.all(tasks)
    console.log(ret)
    worker.exit()
}

main().catch(err => {
    console.log(err)
})
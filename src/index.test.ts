import * as Tasks from './test.tasks'
import { offload } from '.'

test('Buffer', async () => {
    const T = (data: any) => {
        const buffer = Buffer.from(data)
        return buffer
    }
    const worker = await offload(T)
    const ret = await worker('asd')
    worker.exit()
    expect(ret).toBeInstanceOf(Buffer)
})
test('Object', async () => {
    const data = {
        howToCallMe: 'Axel',
        cakeDay: '1989-08-16'
    }
    const worker = await offload(Tasks.echo)
    const ret = await worker(data)
    worker.exit()
    expect(ret).toEqual(data)
})
test('String', async () => {
    const worker = await offload(Tasks.echo)
    const ret = await worker('asd')
    worker.exit()
    expect(ret).toBe('asd')
})

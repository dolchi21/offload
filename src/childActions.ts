import * as uuid from 'uuid'

export const EXEC = 'EXEC'
export const EXIT = 'EXIT'
export const MAIN = 'MAIN'
export const RESPONSE = 'RESPONSE'

export interface Action {
    type: string
    uuid: string
    payload?: any
}

export const exec = (data: any) => ({
    type: EXEC,
    uuid: uuid.v4(),
    payload: data,
})

export const exit = () => ({
    type: EXIT,
    uuid: uuid.v4(),
})

export const setMain = (fn: any) => ({
    type: MAIN,
    uuid: uuid.v4(),
    payload: fn.toString(),
})

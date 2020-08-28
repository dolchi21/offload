export const task0 = (data: any) => {
    const axios = require('axios')
    //@ts-ignore
    return axios.get(data).then(res => res.data)
}
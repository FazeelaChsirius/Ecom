import React from 'react'

interface ErrorInterface {
    message?: string
}

const Error = ({message = "Failed to fetch data retry..."}) => {
    return <h1 className='text-rose-400 font-medium'>{message}</h1>
}

export default Error
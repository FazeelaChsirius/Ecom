import React from 'react'

interface ErrorInterface {
    message?: string
}

const ErrorMessage = ({message = "Failed to fetch data retry..."}) => {
    return <h1 className='text-rose-400 font-medium'>{message}</h1>
}

export default ErrorMessage
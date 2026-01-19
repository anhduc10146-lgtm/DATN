import RootRoute from './RootRoute'
import { BrowserRouter } from 'react-router-dom'
import io from 'socket.io-client'
import React from 'react'

const uri = process.env.REACT_APP_BUILD_MODE_BE === 'production' ? process.env.REACT_APP_API_LIVE : process.env.REACT_APP_API_LOCAL;
const socket = io(uri);

const Routes = () => {
    return (
        <BrowserRouter>
            <RootRoute />
        </BrowserRouter>
    )

}

export default Routes
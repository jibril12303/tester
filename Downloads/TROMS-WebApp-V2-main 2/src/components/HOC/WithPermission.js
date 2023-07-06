import React from 'react'
import { useSelector } from 'react-redux'

const withPermission = (permission) => (Component) => (props) => {
    const roles = useSelector(state => state.appReducer.userDetails?.permissions)
    if(Array.isArray(roles)){
        if(roles.find(permission)){
            return <Component {...props} />
        }
    }
    return null
}

export default withPermission
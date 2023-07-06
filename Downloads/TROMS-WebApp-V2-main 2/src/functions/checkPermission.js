import { useSelector } from 'react-redux'

const checkPermission = (permission)  => {
    // debugger;
    const roles = useSelector(state => state.appReducer.userDetails?.permissions)
    if(permission.startsWith('!')){
        permission.replace('!','')
        if(Array.isArray(roles)){
            if(roles.includes(permission)){
                return false
            }
        }
        return true
    } else {
        if(Array.isArray(roles)){
            if(roles.includes(permission)){
                return true
            }
        }
        return false
    }
    
}

export default checkPermission
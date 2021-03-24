import api from '@/Services'
import CheckHandleResponseErrors from './Util/ResponseErrorHandler'
import { Config } from '@/Config'
import { PurgeStore } from '@/Store'

export default async (token, dispatch) => {
    // Mock data (if selected)
    if (Config.mocking.apiConnection) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return;
    }
    
    // Request data
    var error = undefined;
    const headers = {
        'authorization': token.tokenType + ' ' + token.accessToken,
        'refreshToken': token.refreshToken
    }
    await api.post(`user/logout`, {}, {
        headers: headers
    }).catch(err => error = err);

    // Check for errors
    var errorCheck = CheckHandleResponseErrors(error, dispatch);
    if (!errorCheck[0])
        throw errorCheck[1];
    
    // Remove all data from the Redux store
    dispatch(PurgeStore());
}
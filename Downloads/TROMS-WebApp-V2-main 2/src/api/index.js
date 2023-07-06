// General api to access data
import ApiConstants from './ApiConstants';
export default function api(path, params, method, token) {
    let options;
    options = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        method: method,
        ...(params && { body: JSON.stringify(params) }),
    };

    console.log('BASE_URL: APICall ' + (ApiConstants.BASE_URL + path));
    console.log('Body: APICall ' + JSON.stringify(params));
    console.log('method: APICall ' + method);
    console.log('options: APICall ' + options);
    return fetch(ApiConstants.BASE_URL + path, options)
        .then((resp) => resp.json())
        .then((json) => {
            console.log('json Responce: ', json);
            return json;
        })
        .catch((error) => {
            console.log('<-- Error::', error);
            return error;
        });
}

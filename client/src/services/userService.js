import useHandleResponse from '../utilities/handleResponse';
import authHeader from '../utilities/auth-header';
import { useSnackbar } from 'notistack';

export function useGetUsers() {
    const { enqueueSnackbar } = useSnackbar();
    const handleResponse = useHandleResponse();
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    const getUsers = () => {
        return fetch(
            `/api/users`,
            requestOptions
        )
            .then(handleResponse)
            .catch(() =>
                enqueueSnackbar('Could not load Users', {
                    variant: 'error',
                })
            );
    };

    return getUsers;
}


export function useSearchUsers() {
    const handleResponse = useHandleResponse();

    const searchUsers = (query) => {
        const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify({ query }),
        };

        return fetch(
            `/api/users/search`,
            requestOptions
        )
            .then(handleResponse)
            .catch(err => {
                console.log(err);
            });
    };

    return searchUsers;
}
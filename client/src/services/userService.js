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
            `/api/users/userlist`,
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


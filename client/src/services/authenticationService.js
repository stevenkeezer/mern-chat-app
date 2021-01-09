import { BehaviorSubject } from 'rxjs';
import { useSnackbar } from 'notistack';

import useHandleResponse from '../utilities/handleResponse';

const currentUserSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem('currentUser'))
);

export const authenticationService = {
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value;
    },
};

export function useLogin() {
    const { enqueueSnackbar } = useSnackbar();
    const handleResponse = useHandleResponse();

    const login = (email, password) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        };

        return fetch(
            `${process.env.REACT_APP_API_URL}/api/users/login`,
            requestOptions
        )
            .then(handleResponse)
            .then(user => {
                localStorage.setItem('currentUser', JSON.stringify(user));
                currentUserSubject.next(user);
                return user;
            })
            .catch(function () {
                enqueueSnackbar('Failed to Login', {
                    variant: 'warning',
                });
            });
    };

    return login;
}

export function useRegister() {
    const { enqueueSnackbar } = useSnackbar();
    const handleResponse = useHandleResponse();

    const register = (username, email, password) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        };

        return fetch(
            `${process.env.REACT_APP_API_URL}/api/users/`,
            requestOptions
        )
            .then(handleResponse)
            .then(user => {
                localStorage.setItem('currentUser', JSON.stringify(user));
                currentUserSubject.next(user);
                return user;
            })
            .catch(function (response) {
                if (response) {

                    enqueueSnackbar(response, {
                        variant: 'warning',
                    });
                } else {
                    enqueueSnackbar('Failed to Register', {
                        variant: 'warning',
                    });
                }
            });
    };

    return register;
}


function logout() {
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}


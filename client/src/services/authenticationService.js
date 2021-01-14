import { BehaviorSubject } from 'rxjs';
import { useSnackbar } from 'notistack';

import useHandleResponse from '../utilities/handleResponse';


const currentUserSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem('currentUser'))
);

export const authenticationService = {
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value;
    },
};

export function useVerify() {
    const { enqueueSnackbar } = useSnackbar();

    const verifyUser = (token) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        };

        return fetch(
            `/api/users/authorized`,
            requestOptions
        )
            .then(user => {
                return user
            })
            .catch(function () {
                enqueueSnackbar('Failed to verify token', {
                    variant: 'warning',
                });
            });
    }
    return verifyUser
}


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
            `/api/users/login`,
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
            `/api/users/`,
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


export function useLogout() {
    const { enqueueSnackbar } = useSnackbar();

    const logout = (currentUserId) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentUserId }),
        };

        return fetch(
            `/api/users/logout`,
            requestOptions
        )
            .then(user => {
                localStorage.removeItem('currentUser');
                currentUserSubject.next(user);
                return
            })
            .catch(function () {
                enqueueSnackbar('Failed to Logout', {
                    variant: 'warning',
                });
            });
    }
    return logout
}

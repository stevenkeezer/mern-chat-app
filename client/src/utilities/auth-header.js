import { authenticationService } from '../services/authenticationService';

function authHeader() {
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return {
            Authorization: `${currentUser.token}`,
            'Content-Type': 'application/json',
        };
    } else {
        return {};
    }
}

export default authHeader;

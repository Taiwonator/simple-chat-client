import React from 'react';
import { User as AppUser, FindUserById, Logout, SetUser } from '../types';

interface UserContextProps {
    user: AppUser | null;
    setUser: SetUser;
    logout: Logout;
    findUserById: FindUserById;
}

const UserContext = React.createContext<UserContextProps>({
    user: null,
    setUser: () => null,
    logout: () => null,
    findUserById: async () => null,
});

export { UserContext };
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '../models/CustomJwtPayload';
import { decode as atob } from 'base-64';

if (typeof global.atob === 'undefined') {
  global.atob = atob;
}

export const decodeToken = (token: string): CustomJwtPayload | null => {
    try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        console.log("Decoded JWT:", decoded);
        return decoded;
    } catch (error) {
        console.error("Failed to decode token", error);
        return null;
    }
};

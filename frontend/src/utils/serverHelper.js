import { backendUrl } from "./config";

export const makeUnauthPOSTRequest = async (route, body) => {
    try {
        const response = await fetch(backendUrl + route, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error making unauthenticated POST request:", error);
        throw error;
    }
};

export const makeAuthPOSTRequest = async (route, body) => {
    try {
        const token = getToken();
        const response = await fetch(backendUrl + route, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error making authenticated POST request:", error);
        throw error;
    }
};

export const makeAuthGETRequest = async (route) => {
    try {
        const token = getToken();
        const response = await fetch(backendUrl + route, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error making authenticated GET request:", error);
        throw error;
    }
};

export const makeAuthDELETERequest = async (route) => {
    try {
        const token = getToken();
        const response = await fetch(backendUrl + route, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error making authenticated DELETE request:", error);
        throw error;
    }
};

const getToken = () => {
    const accessToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
    );
    return accessToken;
};

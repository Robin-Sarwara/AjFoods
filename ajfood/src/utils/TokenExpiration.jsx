const getTokenExpiration = (token) => {
    if (!token) return null;
    try {
        const decoded = JSON.parse(atob(token.split(".")[1]));  // Decode JWT payload
        return decoded.exp * 1000;  // Convert to milliseconds
    } catch (error) {
        return null;
    }
};
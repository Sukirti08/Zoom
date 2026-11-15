const IS_PROD = process.env.NODE_ENV === "production";
const server = process.env.REACT_APP_SERVER_URL || (IS_PROD ?
    "https://apnacollegebackend.onrender.com" :

    "http://localhost:8000");


export default server;

const turnUrls = (process.env.REACT_APP_TURN_URLS || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
const turnUsername = process.env.REACT_APP_TURN_USERNAME;
const turnCredential = process.env.REACT_APP_TURN_CREDENTIAL;

export const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];

if (turnUrls.length && turnUsername && turnCredential) {
    iceServers.push({
        urls: turnUrls,
        username: turnUsername,
        credential: turnCredential
    });
}

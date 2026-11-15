# Zoom
A full stack video conferencing web application.

## TURN relay

To enable relayed video calls, set these variables in the frontend environment and restart the dev server or rebuild the frontend.

```dotenv
REACT_APP_TURN_URLS=turn:relay.example.com:3478,turns:relay.example.com:5349
REACT_APP_TURN_USERNAME=your-relay-username
REACT_APP_TURN_CREDENTIAL=your-relay-credential
```

These credentials are visible to browsers. For a public deployment, issue short-lived TURN credentials from a backend.

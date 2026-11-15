# Video Meetings

A Zoom-style portfolio app with guest rooms, shareable links, and browser video
calls. The React frontend uses WebRTC for media and Socket.IO for signaling.
The Express API uses MongoDB for accounts and meeting history.

Portfolio repository maintained by [Sukirti08](https://github.com/Sukirti08).

[Live demo](https://sukirti08-zoom-demo.onrender.com)

## TURN relay

To enable relayed video calls, set these variables in the frontend environment and restart the dev server or rebuild the frontend.

```dotenv
REACT_APP_TURN_URLS=turn:relay.example.com:3478,turns:relay.example.com:5349
REACT_APP_TURN_USERNAME=your-relay-username
REACT_APP_TURN_CREDENTIAL=your-relay-credential
```

These credentials are visible to browsers. For a public deployment, issue short-lived TURN credentials from a backend.

## Deploy the demo

Import this repository as a Render Blueprint. Set the service's `MONGODB_URI` to
a MongoDB connection string for the `zoom` database and allow the service's
outbound addresses in the database project's network access list. Render
builds and serves the React app and API from the same HTTPS origin. The health
endpoint is `/healthz`.

Guest links start a new room. Share that room's URL with the other participant.
Configure TURN if callers may be on networks that block direct WebRTC traffic.

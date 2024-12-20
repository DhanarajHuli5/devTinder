# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequest Router
- POST /request/send/interested/:userId
- POST /request/send/ingnored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requstId

## userRouter 
- GET /user/connections
- GET /user/requests/received
- GET /user/feed - Gets users on platform

Status: ignore, interested, accepted, rejected
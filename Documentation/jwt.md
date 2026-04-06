Architecture Explanation
Here is exactly what every file does and how they all connect.

## Frontend; 
- When a user visits the app, the browser loads home.html which pulls in all your CSS and then runs your scripts in this order: frontend_util.js, app_data.js, auth.js, app.js, flashback.js.
- frontend_util.js is just a helper that provides getTodayDateString(). It runs first so every other script can use it freely.
- app_data.js contains all your fetch functions — fetchRandomWord, fetchWordOfTheDay, addWordToFlashback, showcaseTodaysWord, getLanguageSentences. These are pure data functions. They make HTTP requests to your Express server and return the results. They have no UI logic whatsoever.
- auth.js (frontend) runs initAuth() on load which does two things: injects the Login button and panel into the header DOM, then calls checkAuthOnLoad() which hits /server/auth/me. If the cookie is valid, the user is already logged in and the button updates silently. If not, nothing happens and they see the Login button. When a user logs in successfully, your server sets an HttpOnly cookie in their browser. From that point on, every single fetch the browser makes to your server automatically includes that cookie — you never have to touch it manually.
- app.js runs init() which fetches today's word data and sets up the language form. This runs regardless of auth state because your word routes are currently public. This is fine for now.
- flashback.js injects the Flashback button and panel exactly like auth does. It reuses the same fetchWordOfTheDay and showcaseTodaysWord functions from app_data.js.

## On the server side:
- index.js is the entry point. It starts Express, connects to MongoDB, and mounts two routers — authRouter on /server/auth and readWordsRouter on /server. It also registers cookieParser middleware which is what allows your server to read the JWT cookie from incoming requests.
- routes/auth_routes.js handles four endpoints. POST /server/auth/register creates a new user. POST /server/auth/login verifies credentials and if correct calls jwt.sign() to create a token, then sends it as a cookie. POST /server/auth/logout clears the cookie. GET /server/auth/me is a protected route that returns the current user's data.
- middleware/auth.js (server) is the requireAuth function. When placed on a route it reads req.cookies.token, calls jwt.verify() on it using your JWT_SECRET, extracts the userId, queries MongoDB for that user, and attaches the full user document to req.user. If any step fails it returns 401. If it succeeds, next() is called and your actual route handler runs with req.user available.
- mongodb-database/model/user.js is the Mongoose schema for your users collection. It has email, password, and wordsCompleted. The pre-save hook hashes the password automatically. The comparePassword method is used at login to check the submitted password against the stored hash.
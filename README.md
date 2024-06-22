# Exam #N: "Meme Game"
## Student: S327132 Noohi Sayedali 

## React Client Application Routes

- Route `/`: Home Page Content
- Route `/login`: Login Form For Users
- Route `/profile`: Profile Page Of Users (If logged in)
- Route `/gameAnonym`: Meme Game For Anonymous Users
- Route `/usergame` : Meme Game For Logged-In Users
- Route `/*` : Page Not Found For Anyother Wrong URL


## Main React Components

- `PrivateRoute` (in `client/src/PrivateRoute.jsx`): handle private (or protected) routes in a React application (For Logged-In Users)
- `Authentication Context` (in `client/src/AuthContext.jsx`): manage authentication state and logic within a React application
- `User Game` (in `client/src/Components/UserGame.jsx`) : Page of Game for Users with Users features(e.g : recording their game in their profile)
- `Anonymous Game` (in `client/src/Components/GamePageAnonym.jsx`) : Page of Game for Anonymous Users(Not Logged In) without the features (Just 1 Round)
- `Login Page` (in `client/src/Components/LoginPage.jsx`) : Login Page for Users to be logged in and Play Game as user
- `Profile Page` (in `client\src\Components\ProfilePage.jsx`) : Profile of Users with History of their Game , total Scores , LeaderBoard , etc.
- `Not Found` (in `client/src/Components/NotFound.jsx` ) : Not Found Page for any other Worng URLs
- `Home Page ` (in `client\src\Components\HomePage.jsx`) : Home Page with the Main Content
- `CSS` (in `client\src\Components\CSS`) :  External StyleSheet of our Pages (GamePage,HomePage,LoginPage,ProfilePage)


## API Server


## POST `/api/sessions`
- **Purpose:** Create a new user session (login).
- **Request Parameters and Body Content:**
  - `username`: The username of the user.
  - `password`: The password of the user.
- **Response Body Content:**
  - On success: JSON object representing the user.
  - On failure: JSON object with an error message.
- **Response Status Codes and Possible Errors:**
  - `201 Created`: Successfully created the session.
  - `401 Unauthorized`: Invalid username or password.

## GET `/api/profile`
- **Purpose:** Retrieve the profile of the authenticated user.
- **Request Parameters:** None.
- **Response Body Content:**
  - JSON object representing the user.
- **Response Status Codes and Possible Errors:**
  - `200 OK`: Successfully retrieved user profile.
  - `401 Unauthorized`: User is not authenticated.

## GET `/api/sessions`
- **Purpose:** Check if the user is authenticated.
- **Request Parameters:** None.
- **Response Body Content:**
  - On success: JSON object representing the authenticated user.
  - On failure: JSON object with an error message.
- **Response Status Codes and Possible Errors:**
  - `200 OK`: User is authenticated.
  - `401 Unauthorized`: User is not authenticated.

## DELETE `/api/sessions`
- **Purpose:** Delete the current user session (logout).
- **Request Parameters:** None.
- **Response Body Content:** None.
- **Response Status Codes and Possible Errors:**
  - `200 OK`: Successfully logged out.

## POST `/api/login`
- **Purpose:** Log in a user and return an authentication token.
- **Request Parameters and Body Content:**
  - `username`: The username of the user.
  - `password`: The password of the user.
- **Response Body Content:**
  - On success: JSON object with the authentication token.
  - On failure: JSON object with an error message.
- **Response Status Codes and Possible Errors:**
  - `200 OK`: Successfully logged in.
  - `400 Bad Request`: Invalid username or password.

## POST `/api/logout`
- **Purpose:** Log out the authenticated user.
- **Request Parameters and Body Content:** None.
- **Response Body Content:**
  - JSON object with a logout success message.
- **Response Status Codes and Possible Errors:**
  - `200 OK`: Successfully logged out.
  - `401 Unauthorized`: User is not authenticated.

## GET `/api/users/:username`
- **Purpose:** Retrieve user data by username.
- **Request Parameters:**
  - `username`: The username of the user to retrieve.
- **Response Body Content:**
  - On success: JSON object representing the user.
  - On failure: JSON object with an error message.
- **Response Status Codes and Possible Errors:**
  - `200 OK`: Successfully retrieved user data.
  - `404 Not Found`: User not found.
  - `500 Internal Server Error`: An error occurred while fetching the user.

## GET `/api/users/:username/games`
- **Purpose:** Retrieve the game history of a user by username.
- **Request Parameters:**
  - `username`: The username of the user whose game history to retrieve.
- **Response Body Content:**
  - JSON array of game history objects.
- **Response Status Codes and Possible Errors:**
  - `200 OK`: Successfully retrieved game history.
  - `500 Internal Server Error`: An error occurred while fetching the game history.

## POST `/api/record-game`
- **Purpose:** Record a game for a user.
- **Request Parameters and Body Content:**
  - `round`: The round of the game.
  - `username`: The username of the user.
  - `score`: The score of the user.
  - `caption`: The user's caption.
  - `rightcaption`: The correct caption (optional).
  - `image_path`: The path to the image used in the game.
- **Response Body Content:**
  - On success: JSON object representing the recorded game.
  - On failure: Error message.
- **Response Status Codes and Possible Errors:**
  - `201 Created`: Successfully recorded the game.
  - `400 Bad Request`: Missing required fields.
  - `500 Internal Server Error`: An error occurred while recording the game.

## GET `/api/random-meme`
- **Purpose:** Retrieve a random meme.
- **Request Parameters:** None.
- **Response Body Content:**
  - JSON object representing the meme.
- **Response Status Codes and Possible Errors:**
  - `200 OK`: Successfully retrieved random meme.
  - `500 Internal Server Error`: An error occurred while fetching the meme.

## GET `/api/caption`
- **Purpose:** Retrieve random captions for a game.
- **Request Parameters:** None.
- **Response Body Content:**
  - JSON array of caption objects.
- **Response Status Codes and Possible Errors:**
  - `200 OK`: Successfully retrieved captions.
  - `500 Internal Server Error`: An error occurred while fetching the captions.

## GET `/api/correct-caption/:memeId`
- **Purpose:** Retrieve the correct caption for a given meme.
- **Request Parameters:**
  - `memeId`: The ID of the meme.
- **Response Body Content:**
  - JSON object with the correct caption ID.
- **Response Status Codes and Possible Errors:**
  - `200 OK`: Successfully retrieved correct caption.
  - `500 Internal Server Error`: An error occurred while fetching the correct caption.

## GET `/api/leaderboard`
- **Purpose:** Retrieve the leaderboard with high scores.
- **Request Parameters:** None.
- **Response Body Content:**
  - JSON array of leaderboard objects.
- **Response Status Codes and Possible Errors:**
  - `200 OK`: Successfully retrieved leaderboard.
  - `500 Internal Server Error`: An error occurred while fetching the leaderboard.


## Database Tables

- Table `Users` - *user_id*,*username*,*password_hash*,*salt*,*token*
- Table `Memes` - *meme_id*,*image_path*,*captionid_match*
- Table `MemeCaptions` - *meme_id*,*caption_id*
- Table `Games` - *round*,*username*,*score*,*game_id*,*caption*,*rightcaption*,*image_path*
- Table `Captions` - *caption_id*,*caption_text*


## Screenshots

### Home Page
(./img/HomePage.png)

### Profile Page

(./img/ProfilePage.png)


## Users Credentials

- ali, password 
- ali2, ali2 

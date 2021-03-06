import React from "react";
import firebase from "firebase";

import api from "../util/api";
import UserSettings from "../components/UserSettings";
import Upload from "../components/Upload";

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    const config = {
      apiKey: "AIzaSyDaSF8PfdRA1mjztmQQKWV0v6BusUjvko4",
      authDomain: "sercy-2de63.firebaseapp.com",
      databaseURL: "https://sercy-2de63.firebaseio.com",
      projectId: "sercy-2de63",
      storageBucket: "sercy-2de63.appspot.com",
      messagingSenderId: "724512766832",
    };

    if (!firebase.apps?.length) {
      firebase.initializeApp(config);
    }

    if (!this.state.user) {
      this.setState({
        user: firebase.apps?.length && firebase.auth().currentUser,
      });

      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          console.log("auth state changed", user);
          this.setState({ user });
          // User is signed in.
        } else {
          // No user is signed in.
        }
      });
    }
  }

  handleLogin = async () => {
    const provider = new firebase.auth.GithubAuthProvider();
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const githubToken = result.credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      this.setState({
        user,
      });

      api.post(
        "/api/user",
        {
          githubToken,
          userInfo: result.additionalUserInfo,
        },
        { token: user.qa }
      );

      document.cookie = "__session=" + user.qa + ";max-age=3600";
    } catch (error) {
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    }
  };

  render() {
    let { user } = this.state;
    return (
      <div>
        <h1>Menrva</h1>

        <Upload />
        <div>
          {user && <div>You're logged in as {user.displayName}</div>}
          <button onClick={this.handleLogin}>Login with github</button>

          {user && <UserSettings />}
        </div>
      </div>
    );
  }
}

export default Index;

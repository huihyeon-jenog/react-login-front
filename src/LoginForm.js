import React from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import UserStore from "./stores/UserStore";
import axios from "axios";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      buttonDisabled: false,
    };
  }
  setInputValue(property, val) {
    val = val.trim();
    if (val.length > 12) {
      return;
    }
    this.setState({
      [property]: val,
    });
  }

  resetForm() {
    this.setState({
      username: "",
      password: "",
      buttonDisabled: false,
    });
  }

  onLoginSuccess = (res) => {
    const JWT_EXPIRY_TIME = 24 * 3600 * 1000;
    const { accessToken } = res.data;
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setTimeout(this.onSilentRefresh, JWT_EXPIRY_TIME - 6000);
  };
  onSilentRefresh = () => {
    axios
      .post("/silent-refresh", data)
      .then(this.onLoginSuccess)
      .catch((e) => console.log(e));
  };
  async doLogin() {
    if (!this.state.username) {
      return;
    }
    if (!this.state.password) {
      return;
    }
    this.setState({
      buttonDisabled: true,
    });

    const data = {
      username,
      password,
    };
    await axios
      .post("/login", data)
      .then(onLoginSuccess)
      .catch((e) => {
        console.log(e);
      });
    // try {
    //   let res = await fetch("/login", {
    //     method: "post",
    //     headers: {
    //       "Content-type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       username: this.state.username,
    //       password: this.state.password,
    //     }),
    //   });
    //   let result = await res.json();
    //   if (result && result.success) {
    //     UserStore.isLoggedIn = true;
    //     UserStore.username = result.username;
    //   } else if (result && result.success === false) {
    //     this.resetForm();
    //     alert(result.msg);
    //   }
    // } catch (e) {
    //   console.log(e);
    //   this.resetForm();
    // }
  }
  render() {
    return (
      <div className="loginForm">
        Log in
        <InputField
          type="text"
          placeholder="Username"
          value={this.state.username ? this.state.username : ""}
          onChange={(val) => this.setInputValue("username", val)}
        />
        <InputField
          type="password"
          placeholder="Password"
          value={this.state.password ? this.state.password : ""}
          onChange={(val) => this.setInputValue("password", val)}
        />
        <SubmitButton
          text="Login"
          disabled={this.state.buttonDisabled}
          onClick={() => this.doLogin()}
        />
      </div>
    );
  }
}
export default LoginForm;

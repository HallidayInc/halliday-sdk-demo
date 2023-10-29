
import { useState } from "react";
import { Halliday } from "halliday-sdk";
import { buttonStyle } from "./Content";

export default function LogInOptions({hallidayClient}: {hallidayClient: Halliday}) {
  const [email, setEmail] = useState("");

  return (<>
    <div
      style={buttonStyle}
      onClick={() => hallidayClient.logInWithGoogle()}
    >
      Log In With Google
    </div>
    <div
      style={buttonStyle}
      onClick={() => hallidayClient.logInWithFacebook()}
    >
      Log In With Facebook
    </div>
    <div
      style={buttonStyle}
      onClick={() => hallidayClient.logInWithTwitter()}
    >
      Log In With Twitter
    </div>

    <br />
    <div style={{ fontSize: "22px" }}>Log In With Email</div>
    <input
      type="text"
      style={{ padding: "10px" }}
      placeholder="Email"
      onChange={(event) => setEmail(event.target.value)}
    />
    <div
      style={buttonStyle}
      onClick={() => hallidayClient.logInWithEmailOTP(email)}
    >
      Log In
    </div>
  </>);
}
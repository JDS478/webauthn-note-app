// TODO: Add an ability to authenticate with a passkey: Create the authenticate() function.
export async function authenticate() {

  // TODO: Add an ability to authenticate with a passkey: Obtain the
  // challenge and other options from the server endpoint.
  const options = await _fetch('/auth/signinRequest');

  // TODO: Add an ability to authenticate with a passkey: Locally verify
  // the user and get a credential.
  // Base64URL decode the challenge.
  options.challenge = base64url.decode(options.challenge);

  // The empty allowCredentials array invokes an account selector
  options.allowCredentials = [];

  // Invoke the WebAuthn get() function.
  const cred = await navigator.credentials.get({
    publicKey: options,

    // Request a conditional UI.
    mediation: 'conditional'
  });

  // TODO: Add an ability to authenticate with a passkey: Verify the credential.
  const credential = {};
  credential.id = cred.id;
  credential.rawId = cred.id; // Pass a Base64URL encoded ID string.
  credential.type = cred.type;

  // Base64URL encode some values.
  const clientDataJSON = base64url.encode(cred.response.clientDataJSON);
  const authenticatorData =
  base64url.encode(cred.response.authenticatorData);
  const signature = base64url.encode(cred.response.signature);
  const userHandle = base64url.encode(cred.response.userHandle);

  credential.response = {
    clientDataJSON,
    authenticatorData,
    signature,
    userHandle,
  };

  return await _fetch(`/auth/signinResponse`, credential);
};

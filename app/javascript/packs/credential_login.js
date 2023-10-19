export default () => {
  if (document.getElementById('credential-login-btn')) {
    document.querySelector('#credential-login-btn').addEventListener('click', async () => {
      const username = document.querySelector('#username-input');

      const userOptions = await getUserOptions(username);
      // const loginCallbackUrl = '/dashboard/callback';

      // create(loginCallbackUrl, userOptions);
    })
  }
}

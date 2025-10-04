const awsExports = {
  Auth: {
    Cognito: {
      userPoolId: 'poolid',
      userPoolClientId: 'poolclientid',
      signUpVerificationMethod: 'code',
      loginWith: { 
        email: true, 
        username: false, 
        phone: false,
        oauth: {
          domain: 'domainid',
          scopes: ['email', 'openid', 'profile'], // ✅ Fixed order
          redirectSignIn: ['http://localhost:3000/dashboard'],
          redirectSignOut: ['http://localhost:3000/login'],
          responseType: 'code',
          providers: ['Google']
        }
      }
    }
  }
};

export default awsExports;

// src/aws-exports.js

const awsExports = {
  Auth: {
    Cognito: {
      // Replace these with the values from your Cognito setup
      userPoolId: "eu-north-1_0rMffvOo6",       // e.g., ap-south-1_AbCdEf123
      userPoolClientId: "3ktmjs04suupvi40f1h8le0or3",   // e.g., 12ab34cd56efgh789ijklmn
      signUpVerificationMethod: "code",        // or "link"
      loginWith: {
        // ✅ Amplify v6 requires you to specify allowed login methods
        email: true,
        username: false,
        phone: false,
      },
      oauth: {
        domain: "https://eu-north-10rmffvoo6.auth.eu-north-1.amazoncognito.com", // ✅ correct domain
        scope: ["openid", "email", "phone"],
        redirectSignIn: "http://localhost:3000/dashboard",
        redirectSignOut: "http://localhost:3000/login",
        responseType: "code",
        }
    },
  },
};

export default awsExports;
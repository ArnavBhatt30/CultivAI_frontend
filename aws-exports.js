// src/aws-exports.js

const awsExports = {
  Auth: {
    Cognito: {
      
      userPoolId: "ur userpoolid",       
      userPoolClientId: "poolclientid",   
      signUpVerificationMethod: "code",      
      loginWith: {
        
        email: true,
        username: false,
        phone: false,
      },
      oauth: {
        domain: "domain", // ✅ correct domain
        scope: ["openid", "email", "phone"],
        redirectSignIn: "link",
        redirectSignOut: "link",
        responseType: "code",
        }
    },
  },
};


export default awsExports;

import * as AwsCognito from "amazon-cognito-identity-js";
import { get, writable } from "svelte/store";
import { z } from "zod";

const authSessionModel = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
  tokenId: z.string(),
  expiration: z.number(),
  issuedAt: z.string().pipe(z.coerce.date())
})

type AuthSession = z.infer<typeof authSessionModel>;

const TOKEN_KEY = "auth-session";

function loadSession(): AuthSession | null {
  try {
    const rawSession = localStorage.getItem(TOKEN_KEY);

    if (!rawSession) {
      return null;
    }

    const session = authSessionModel.parse(JSON.parse(rawSession));
    console.log("Session loaded");
    return session;

  } catch (err) {
    console.error(err);
    return null;
  }
}

const authSessionWritable = writable<AuthSession | null>(loadSession());

authSessionWritable.subscribe((session) => {
  console.log("session updated")
  localStorage.setItem(TOKEN_KEY, JSON.stringify(session));
})

const userPool = new AwsCognito.CognitoUserPool({
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID
});

async function signIn(username: string, password: string) {
  const cognitoUser = new AwsCognito.CognitoUser({
    Username: username,
    Pool: userPool
  });

  const session = await new Promise<AwsCognito.CognitoUserSession>((resolve, reject) => {
    const authenticationDetails = new AwsCognito.AuthenticationDetails({
      Username: username,
      Password: password
    }); /// AwsCognito

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess(session) {
        resolve(session)
      },
      onFailure(err) {
        reject(err)
      }
    })
  })

  if (!session.isValid()) {
    throw new Error("User session is invalid")
  }

  const idToken = session.getIdToken();

  authSessionWritable.set({
    accessToken: session.getAccessToken().getJwtToken(),
    refreshToken: session.getRefreshToken().getToken(),
    tokenId: idToken.getJwtToken(),
    expiration: idToken.getExpiration(),
    issuedAt: new Date(idToken.getIssuedAt())
  })

  return session;
}

function logOut() {
  authSessionWritable.set(null);
}

function isAuthenticated() {
  return get(authSessionWritable) != null;
}

export default {
  isAuthenticated,
  signIn,
  logOut,
  subscribe: authSessionWritable.subscribe
}
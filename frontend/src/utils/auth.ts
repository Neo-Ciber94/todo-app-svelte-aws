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

const AUTH_TOKEN = "auth-session";

function loadSession(): AuthSession | null {
  try {
    const rawSession = localStorage.getItem(AUTH_TOKEN);

    if (!rawSession) {
      return null;
    }

    const session = authSessionModel.parse(JSON.parse(rawSession));
    const issuedAt = session.issuedAt.getTime();

    if (issuedAt > session.expiration) {
      console.warn("Session expired");
      localStorage.removeItem(AUTH_TOKEN);
      return null;
    }

    return session;

  } catch (err) {
    console.error(err);
    return null;
  }
}

const authSessionWritable = writable<AuthSession | null>(loadSession());

authSessionWritable.subscribe((session) => {
  if (session == null) {
    localStorage.removeItem(AUTH_TOKEN);
  } else {
    localStorage.setItem(AUTH_TOKEN, JSON.stringify(session));
  }
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

async function register(username: string, password: string) {
  const result = await new Promise<AwsCognito.ISignUpResult | undefined>((resolve, reject) => userPool.signUp(username, password, [], [], (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result)
    }
  }));

  if (result == null) {
    throw new Error("failed to register");
  }

  if (result.userConfirmed) {
    console.log("user is confirmed");
  }

  return result.user;
}

export async function confirmUser(username: string, code: string) {
  const cognitoUser = new AwsCognito.CognitoUser({
    Username: username,
    Pool: userPool
  });

  const result = await new Promise((resolve, reject) => cognitoUser.confirmRegistration(code, false, (err, result) => {
    if (err) {
      reject(err)
    } else {
      resolve(result)
    }
  }));
}

function logOut() {
  authSessionWritable.set(null);
}

function isAuthenticated() {
  return get(authSessionWritable) != null;
}

function getToken() {
  return get(authSessionWritable)?.tokenId
}

export default {
  isAuthenticated,
  getToken,
  signIn,
  register,
  confirmUser,
  logOut,
  subscribe: authSessionWritable.subscribe
}
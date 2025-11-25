import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";
import { Route, Routes, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
// import { toast } from "react-hot-toast";
import * as Sentry from "@sentry/react";

const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

const App = () => {
  return (
    <>
    <button onClick={() =>{
      throw new Error("Test Sentry Error from App.jsx");
    }}
    >
      Test Sentry Error
    </button>

      <SignedIn>
        <SentryRoutes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<Navigate to={"/"} replace />} />
        </SentryRoutes>
        <UserButton />
      </SignedIn>

      <SignedOut>
        <SentryRoutes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to={"/auth"} replace />} />
        </SentryRoutes>
      </SignedOut>
    </>
  );
};

export default App;
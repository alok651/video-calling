import { useAuth } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import * as Sentry from "@sentry/react";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import CallPage from "./pages/CallPage";

const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

const App = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  return (
    <SentryRoutes>
      {/* HOME */}
      <Route
        path="/"
        element={isSignedIn ? <HomePage /> : <Navigate to="/auth" replace />}
      />

      {/* AUTH */}
      <Route
        path="/auth"
        element={!isSignedIn ? <AuthPage /> : <Navigate to="/" replace />}
      />

      {/* CALL PAGE */}
      <Route
        path="/call/:id"
        element={isSignedIn ? <CallPage /> : <Navigate to="/auth" replace />}
      />

      {/* 404 HANDLER */}
      <Route
        path="*"
        element={
          isSignedIn ? <Navigate to="/" replace /> : <Navigate to="/auth" replace />
        }
      />
    </SentryRoutes>
  );
};

export default App;


//first version of routing

// return (
//   <>

//     <SignedIn>
//       <SentryRoutes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/auth" element={<Navigate to={"/"} replace />} />
//       </SentryRoutes>
//       <UserButton />
//     </SignedIn>

//     <SignedOut>
//       <SentryRoutes>
//         <Route path="/auth" element={<AuthPage />} />
//         <Route path="*" element={<Navigate to={"/auth"} replace />} />
//       </SentryRoutes>
//     </SignedOut>
//   </>
// );

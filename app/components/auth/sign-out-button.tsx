// "use client";

// import { handleSignOut } from "@/lib/signOutServerAction";

// export const SignOutButton = (props: {
//   children?: React.ReactNode;
//   className?: string;
// }) => {
//   return (
//     <button
//       className={props.className}
//       style={{ cursor: "pointer" }}
//       onClick={() => handleSignOut()}
//     >
//       {props.children || "Sign Out"}
//     </button>
//   );
// };
"use client";

import { useState } from "react";
import { Button, CircularProgress, Tooltip } from "@mui/material";
import { handleSignOut } from "@/lib/signOutServerAction";

export const SignOutButton = (props: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [loading, setLoading] = useState(false);

  const onSignOut = async () => {
    setLoading(true);
    try {
      await handleSignOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title="Sign Out">
      <Button
        variant="contained"
        color="primary"
        className={props.className}
        onClick={onSignOut}
        disabled={loading}
        style={{ cursor: "pointer", position: "relative" }}
      >
        {loading ? (
          <CircularProgress size={24} style={{ color: "white" }} />
        ) : (
          props.children || "Sign Out"
        )}
      </Button>
    </Tooltip>
  );
};
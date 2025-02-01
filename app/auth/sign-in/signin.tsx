"use client";

import { useState, useEffect } from "react";
import { useTransition } from "react";
import { signIn } from "next-auth/react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { FaFingerprint } from "react-icons/fa";
import { handleEmailSignIn } from "@/lib/emailSignInServerAction";
import Image from "next/image";
import backgroundImage from "@/public/images/bg2 (1).jpg";
import { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/types";
import { startAuthentication } from "@simplewebauthn/browser";

export const SignInPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({ email: "" });
  const [canUseBiometric, setCanUseBiometric] = useState(false);

  useEffect(() => {
    const checkPreviousSignIn = async () => {
      const response = await fetch("/api/auth/webauthn/check-user", {
        method: "POST",
        body: JSON.stringify({ email: formData.email }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setCanUseBiometric(data.hasPreviousSignIn);
    };
    if (formData.email) checkPreviousSignIn();
  }, [formData.email]);

  async function signInWithWebauthn() {
    if (!canUseBiometric) {
      alert(
        "Please sign in with Email or Google first before using Biometric Authentication."
      );
      return;
    }

    const url = new URL(
      "/api/auth/webauthn/authenticate",
      window.location.origin
    );
    url.search = new URLSearchParams({ email: formData.email }).toString();
    const optionsResponse = await fetch(url.toString());

    if (optionsResponse.status !== 200) {
      throw new Error("Could not get authentication options from server");
    }
    const opt: PublicKeyCredentialRequestOptionsJSON =
      await optionsResponse.json();

    if (!opt.allowCredentials || opt.allowCredentials.length === 0) {
      throw new Error("There is no registered credential.");
    }

    const credential = await startAuthentication(opt);

    await signIn("credentials", {
      id: credential.id,
      rawId: credential.rawId,
      type: credential.type,
      clientDataJSON: credential.response.clientDataJSON,
      authenticatorData: credential.response.authenticatorData,
      signature: credential.response.signature,
      userHandle: credential.response.userHandle,
    });
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await signInWithWebauthn();
    } catch (error) {
      console.log(error);
      try {
        startTransition(async () => {
          await handleEmailSignIn(formData.email);
          setLoading(false);
        });
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          height: "100%",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            flex: 1,
            position: "relative",
          }}
        >
          <Image
            src={backgroundImage}
            alt="Background"
            layout="fill"
            objectFit="cover"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Paper
            elevation={6}
            sx={{ padding: 4, width: "100%", maxWidth: 400 }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Sign In
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(event) => setFormData({ email: event.target.value })}
                disabled={isPending}
              />
              <Tooltip
                title={loading ? "Processing..." : "Sign in with your email"}
                arrow
              >
                <span>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isPending || loading}
                    startIcon={
                      loading && <CircularProgress size={20} color="inherit" />
                    }
                  >
                    Sign in with email
                  </Button>
                </span>
              </Tooltip>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <Typography variant="body2" sx={{ mx: 2 }}>
                  or
                </Typography>
              </Box>
              <Tooltip
                title={
                  loading ? "Processing..." : "Sign in with your Google account"
                }
                arrow
              >
                <span>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    startIcon={<FcGoogle />}
                    onClick={() => {
                      setLoading(true);
                      signIn("google").finally(() => setLoading(false));
                    }}
                    sx={{ mt: 2 }}
                    disabled={isPending || loading}
                  >
                    {loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Sign in with Google"
                    )}
                  </Button>
                </span>
              </Tooltip>
              <Tooltip
                title={
                  !canUseBiometric
                    ? "Sign in with Email or Google first"
                    : "Sign in with Biometrics"
                }
                arrow
              >
                <span>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<FaFingerprint />}
                    onClick={signInWithWebauthn}
                    sx={{ mt: 2 }}
                    disabled={!canUseBiometric || loading}
                  >
                    Sign in with Biometrics
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default SignInPage;

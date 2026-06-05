import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../apiClient";
import { toast } from "react-toastify";
import API from "../API";
import "../components/user-auth/SignUp.css";
import PasswordField from "../components/PasswordField";

const MIN_PASSWORD_LEN = 5;

const getStrength = (pass) => {
  if (pass.length >= MIN_PASSWORD_LEN ) return "strong";
  if (pass.length > 0) return "weak";
  return null;
};

const strengthLabel = { weak: "Too short or too long", strong: "Valid length" };
const strengthClass = { weak: "bg-danger", strong: "bg-success" };
const strengthTextClass = { weak: "text-danger", strong: "text-success" };

function parseEmailFromQuery(emailParam) {
  if (!emailParam || typeof emailParam !== "string") return "";
  try {
    return decodeURIComponent(emailParam.replace(/\+/g, " ")).trim();
  } catch {
    return emailParam.trim();
  }
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromLink = parseEmailFromQuery(searchParams.get("email"));

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const strength = getStrength(newPassword);
  const matchError = Boolean(
    newPassword && confirmPassword && newPassword !== confirmPassword
  );
  const passwordLengthOk =
    newPassword.length >= MIN_PASSWORD_LEN 

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!emailFromLink) {
      toast.error("Invalid reset link. Request a new one from forgot password.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      toast.error("Enter and confirm your new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!passwordLengthOk) {
      toast.error(
        `Password must be ${MIN_PASSWORD_LEN} characters (same as sign-up).`
      );
      return;
    }

    try {
      setIsLoading(true);
      await apiClient.post(API.UPDATE_PASSWORD, {
        email: emailFromLink,
        password: newPassword,
      });
      toast.success("Password reset successfully. You can sign in now.");
      navigate("/sign-in");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not reset password. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!emailFromLink) {
    return (
      <div className="signup-container d-flex flex-column flex-md-row min-vh-100">
        <div className="left-section d-none d-md-block">
          <img
            src="https://res.cloudinary.com/madimages/image/fetch/q_100,f_auto,w_793,h_502/https://s3.amazonaws.com/mobileappdaily/mad/uploads/mad_blog_5ddf7cfcc5bfc1574927612.jpg"
            alt=""
            className="img-fluid"
            style={{ opacity: "50%" }}
          />
        </div>
        <div className="right-section d-flex flex-column justify-content-center align-items-center p-4 flex-grow-1">
          <div className="form-box text-center">
            <img src="/assets/logo.png" alt="Trackly" height="40" className="mb-3" />
            <h4 className="mb-3">Invalid reset link</h4>
            <p className="text-muted mb-4">
              This link is missing your email. Request a new password reset from the forgot password page.
            </p>
            <Link to="/forget-password" className="btn btn-primary w-100 mb-2">
              Forgot password
            </Link>
            <Link to="/sign-in" className="btn btn-outline-secondary w-100">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container d-flex flex-column flex-md-row min-vh-100">
      <div className="left-section d-none d-md-block">
        <img
          src="https://res.cloudinary.com/madimages/image/fetch/q_100,f_auto,w_793,h_502/https://s3.amazonaws.com/mobileappdaily/mad/uploads/mad_blog_5ddf7cfcc5bfc1574927612.jpg"
          alt=""
          className="img-fluid"
          style={{ opacity: "50%" }}
        />
      </div>

      <div className="right-section d-flex flex-column justify-content-center align-items-center p-4 flex-grow-1">
        <div className="w-100 text-start mb-3" style={{ maxWidth: 400 }}>
          <span role="button" onClick={() => navigate("/sign-in")} className="text-primary">
            ← Back to sign in
          </span>
        </div>

        {isLoading ? (
          <div className="spinner-border text-success" role="status" />
        ) : (
          <div className="form-box">
            <div className="text-center mb-4">
              <img src="/assets/logo.png" alt="Trackly" height="40" />
            </div>
            <h4 className="text-center mb-2">Reset password</h4>
            <p className="text-center text-muted small mb-4">
              Choose a new password for your account.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label className="text-secondary small">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={emailFromLink}
                  readOnly
                  aria-readonly="true"
                />
              </div>

              <div className="form-group mb-3">
                <label>New password</label>
                <PasswordField
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder={`${MIN_PASSWORD_LEN} characters`}
                />
                {strength && (
                  <>
                    <div className="progress mt-1" style={{ height: 6 }}>
                      <div
                        className={`progress-bar ${strengthClass[strength]}`}
                        style={{ width: strength === "strong" ? "100%" : "40%" }}
                      />
                    </div>
                    <small className={strengthTextClass[strength]}>
                      {strengthLabel[strength]} {" "}
                      {strength === "strong"
                        ? "You're good to go."
                        : `Use ${MIN_PASSWORD_LEN} characters (same rules as sign-up).`}
                    </small>
                  </>
                )}
              </div>

              <div className="form-group mb-3">
                <label>Confirm password</label>
                <PasswordField
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                {matchError && (
                  <small className="text-danger d-block mt-1">
                    Passwords do not match.
                  </small>
                )}
              </div>

              <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
                Reset password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;

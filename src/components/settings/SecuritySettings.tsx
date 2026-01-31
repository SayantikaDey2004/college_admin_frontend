import React, { useState, useCallback, memo } from "react";
import { FiLock, FiEye, FiEyeOff, FiSave } from "react-icons/fi";
import api from "../../config/axios.config";

interface SecuritySettingsProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleVisibility: () => void;
  placeholder: string;
  helperText?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = memo(
  ({
    label,
    value,
    onChange,
    showPassword,
    onToggleVisibility,
    placeholder,
    helperText,
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
      </div>
      {helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  ),
);

PasswordInput.displayName = "PasswordInput";

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  onSuccess,
  onError,
  isLoading,
  setIsLoading,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleCurrentPassword = useCallback(
    () => setShowCurrentPassword((prev) => !prev),
    [],
  );
  const toggleNewPassword = useCallback(
    () => setShowNewPassword((prev) => !prev),
    [],
  );
  const toggleConfirmPassword = useCallback(
    () => setShowConfirmPassword((prev) => !prev),
    [],
  );

  const validatePassword = useCallback((password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long!";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter!";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter!";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number!";
    }
    return null;
  }, []);

  const handlePasswordSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (newPassword !== confirmPassword) {
        onError("New passwords do not match!");
        return;
      }

      const validationError = validatePassword(newPassword);
      if (validationError) {
        onError(validationError);
        return;
      }

      setIsLoading(true);

      try {
        const response = await api.patch("/auth/update-password", {
          currentPassword,
          newPassword,
        });

        if (response.status === 200) {
          onSuccess("Password changed successfully!");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setShowCurrentPassword(false);
          setShowNewPassword(false);
          setShowConfirmPassword(false);
        }
      } catch {
        onError(
          "Failed to change password. Please check your current password.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentPassword,
      newPassword,
      confirmPassword,
      onSuccess,
      onError,
      setIsLoading,
      validatePassword,
    ],
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Security Settings
      </h2>
      <p className="text-gray-600 mb-6">
        Manage your password and account security.
      </p>

      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
          showPassword={showCurrentPassword}
          onToggleVisibility={toggleCurrentPassword}
          placeholder="Enter current password"
        />

        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          showPassword={showNewPassword}
          onToggleVisibility={toggleNewPassword}
          placeholder="Enter new password"
          helperText="Must be at least 8 characters with uppercase, lowercase, and numbers"
        />

        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          showPassword={showConfirmPassword}
          onToggleVisibility={toggleConfirmPassword}
          placeholder="Confirm new password"
        />

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium shadow-md"
          >
            <FiSave size={18} />
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default memo(SecuritySettings);

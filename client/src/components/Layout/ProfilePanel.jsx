import { useEffect, useState, useRef } from "react";
import { X, LogOut, Upload, Eye, EyeOff, User, Mail, Shield, Edit2, Save, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toggleProfilePanel } from "../../store/slices/popupSlice";
import { logout, updateProfile, updatePassword } from "../../store/slices/authSlice";
import { Link } from "react-router-dom";


const ProfilePanel = () => {
  const dispatch = useDispatch();
  const { isProfilePanelOpen } = useSelector((state) => state.popup);
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector((state) => state.auth);
  const { isAuthPopupOpen } = useSelector((state) => state.popup);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        email: authUser.email || "",
      });
      setAvatarPreview(authUser.avatar?.url || null);
    }
  }, [authUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setFormData({ ...formData, avatar: file }); // Store the file object, not the base64 string for upload if backend expects file
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const resetForm = () => {
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        email: authUser.email || "",
        avatar: "",
      });
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setIsEditing(false);
  };

  useEffect(() => {
    if (isProfilePanelOpen) {
      resetForm();
    }
  }, [isProfilePanelOpen, authUser]);

  const handleUpdateProfile = () => {
    const updateData = new FormData();
    updateData.append("name", formData.name);
    updateData.append("email", formData.email);
    if (formData.avatar) updateData.append("avatar", formData.avatar);
    dispatch(updateProfile(updateData));
  }

  const handleUpdatePassword = () => {
    const passwordData = new FormData();
    passwordData.append("currentPassword", currentPassword);
    passwordData.append("newPassword", newPassword);
    passwordData.append("confirmNewPassword", confirmNewPassword);
    dispatch(updatePassword(passwordData));
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update Profile
    const updateData = new FormData();
    // Only append if changed or if it's a file. 
    // Logic: If name changed, append name. If avatar changed (it's a File object), append avatar.
    let profileChanged = false;

    if (formData.name !== authUser.name) {
      updateData.append("name", formData.name);
      profileChanged = true;
    } else {
      // Backend usually expects name/email even if unchanged if using `put` to replace resource, 
      // OR we just send what changed. 
      // Looking at backend controller: it updates name/email always. 
      // So we should append name/email always if we are firing the request.
      updateData.append("name", formData.name);
    }

    updateData.append("email", formData.email); // Email is needed

    if (formData.avatar && typeof formData.avatar === 'object') {
      updateData.append("avatar", formData.avatar);
      profileChanged = true;
    }

    // Only dispatch if something changed or if it's just name/email update which is always true because we set isEditing=true
    await dispatch(updateProfile(updateData));


    // Update Password if provided
    if (currentPassword && newPassword) {
      if (newPassword !== confirmNewPassword) {
        toast.error("New passwords do not match");
        return;
      }
      const passwordData = new FormData();
      passwordData.append("currentPassword", currentPassword);
      passwordData.append("newPassword", newPassword);
      passwordData.append("confirmNewPassword", confirmNewPassword);
      await dispatch(updatePassword(passwordData));
    }

    setIsEditing(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(toggleProfilePanel());
  };

  if (!authUser || !isProfilePanelOpen) return null;

  return (
    <>
      {/* Backdrop */}
      {isProfilePanelOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => dispatch(toggleProfilePanel())}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-background shadow-2xl transition-transform duration-300 ease-in-out ${isProfilePanelOpen ? "translate-x-0 animate-slide-in-right" : "translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold">My Profile</h2>
            <button
              onClick={() => dispatch(toggleProfilePanel())}
              className="rounded-full p-2 hover:bg-accent hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-8 flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={() => isEditing && fileInputRef.current.click()}>
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : authUser?.avatar?.url ? (
                    <img src={authUser.avatar.url || "/avatar-holder.avif"} alt={authUser.name} className="h-full w-full object-cover" />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                {isEditing && (
                  <div className="absolute bottom-4 right-0 p-1.5 bg-primary text-primary-foreground rounded-full shadow-lg transform translate-x-1/4 translate-y-1/4">
                    <Upload size={14} />
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={!isEditing}
              />

              <h3 className="text-xl font-bold">{authUser.name}</h3>
              <p className="text-muted-foreground">{authUser.email}</p>
              <div className="mt-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {authUser.role}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full rounded-lg border bg-background px-10 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary ${isEditing ? "border-input focus:border-primary" : "border-transparent cursor-default"
                      }`}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-transparent bg-muted/50 px-10 py-2 text-muted-foreground"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="space-y-4 animate-fade-in-up">
                  <div className="border-t border-border pt-4">
                    <h4 className="mb-3 text-sm font-semibold text-foreground">Change Password</h4>

                    <div className="space-y-3">
                      <div>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isEditing ? (
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 rounded-lg border border-border bg-background py-2 font-semibold text-foreground hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile || isUpdatingPassword}
                    className="flex-1 rounded-lg bg-primary py-2 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {(isUpdatingProfile || isUpdatingPassword) ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              )}
            </form>

            <div className="mt-8 space-y-2">
              <Link
                to="/orders"
                onClick={() => dispatch(toggleProfilePanel())}
                className="flex w-full items-center justify-between rounded-lg border border-border p-4 hover:bg-accent transition-colors"
              >
                <span className="font-medium">My Orders</span>
                <span className="text-muted-foreground">→</span>
              </Link>
              {authUser.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => dispatch(toggleProfilePanel())}
                  className="flex w-full items-center justify-between rounded-lg border border-border p-4 hover:bg-accent transition-colors"
                >
                  <span className="font-medium">Admin Dashboard</span>
                  <span className="text-muted-foreground">→</span>
                </Link>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 py-2 font-semibold text-destructive hover:bg-destructive/20 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    useGetMyProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
} from "@/redux/api/userApi";
import { uploadToImgBB } from "@/helpers/imgbb.uploads";
import { removeUser } from "@/services/auth.services";
import {
    User, Lock, Camera, Loader2, Check, Eye, EyeOff, ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

// ── Role badge colors ────────────────────────────────────────────────────────
const ROLE_STYLES: Record<string, string> = {
    user: "bg-gray-100 text-gray-600",
    admin: "bg-blue-100 text-blue-700",
    superAdmin: "bg-purple-100 text-purple-700",
};

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children }: {
    title: string; icon: React.ElementType; children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #B5451B22, #D4860A22)" }}>
                    <Icon className="w-4 h-4" style={{ color: "#B5451B" }} />
                </div>
                <h2 className="text-base font-bold text-gray-900">{title}</h2>
            </div>
            {children}
        </div>
    );
}

// ── Password input ───────────────────────────────────────────────────────────
function PasswordInput({ label, value, onChange, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label className="label">{label}</label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    className="input-field pr-10"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function ProfileSettings() {
    const router = useRouter();

    const { data: profileData, isLoading } = useGetMyProfileQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    // RTK Query unwraps the { data } property from baseQuery's return value.
    // Our axiosInstance returns { data: userObject, meta: ... }.
    // So profileData is exactly the user object directly.
    const profile = profileData;

    const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
    const [changePasswordMutation, { isLoading: changingPw }] = useChangePasswordMutation();

    // ── Profile form state ────────────────────────────────────────────────────
    const [username, setUsername] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [address, setAddress] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Password form state ───────────────────────────────────────────────────
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Populate form when profile loads
    useEffect(() => {
        if (profile) {
            setUsername(profile.username || "");
            setContactNumber(profile.contactNumber || "");
            setAddress(profile.address || "");
            setProfilePicture(profile.profilePicture || "");
        }
    }, [profile]);

    // ── Profile picture upload ────────────────────────────────────────────────
    const handleImageUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) return;
        try {
            setUploading(true);
            const url = await uploadToImgBB(file);
            setProfilePicture(url);
        } catch (err: any) {
            toast.error(err.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageUpload(file);
        e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleImageUpload(file);
    };

    // ── Save profile ──────────────────────────────────────────────────────────
    const handleSaveProfile = async () => {
        try {
            const payload: Record<string, string> = {};
            if (username !== (profile?.username || "")) payload.username = username;
            if (contactNumber !== (profile?.contactNumber || "")) payload.contactNumber = contactNumber;
            if (address !== (profile?.address || "")) payload.address = address;
            if (profilePicture !== (profile?.profilePicture || "")) payload.profilePicture = profilePicture;

            if (Object.keys(payload).length === 0) {
                toast.info("No changes to save.");
                return;
            }
            await updateProfile(payload).unwrap();
            toast.success("Profile updated successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update profile.");
        }
    };

    // ── Change password ───────────────────────────────────────────────────────
    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all password fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match.");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters.");
            return;
        }
        try {
            await changePasswordMutation({ oldPassword, newPassword }).unwrap();
            toast.success("Password changed! Logging you out...");
            // Clear session and redirect to login
            setTimeout(() => {
                removeUser();
                router.push("/login");
            }, 1500);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to change password.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#B5451B" }} />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
            {/* Page header */}
            <div className="mb-2">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage your account profile and password</p>
            </div>

            {/* Current profile snapshot */}
            <div className="bg-gradient-to-r from-[#B5451B] to-[#D4860A] rounded-2xl p-5 text-white flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0 relative">
                    {profile?.profilePicture ? (
                        <Image src={profile.profilePicture} alt="Profile" fill className="object-cover" />
                    ) : (
                        <span className="text-2xl font-bold">
                            {(profile?.username || "U").charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <div>
                    <p className="font-bold text-lg leading-tight">{profile?.username}</p>
                    <p className="text-white/80 text-sm">{profile?.email}</p>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-1 inline-block ${ROLE_STYLES[profile?.role || "user"]}`}>
                        {profile?.role}
                    </span>
                </div>
            </div>

            {/* ── Profile Info Section ──────────────────────────────────────── */}
            <Section title="Profile Information" icon={User}>
                {/* Profile picture upload */}
                <div className="mb-5">
                    <label className="label">Profile Picture</label>
                    <div className="flex items-start gap-4">
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        {profilePicture ? (
                            <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                                <Image src={profilePicture} alt="Profile" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-white text-gray-800 text-xs px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-gray-100"
                                    >
                                        <Camera className="w-3 h-3" /> Change
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors flex-shrink-0 ${dragOver ? "border-[#B5451B] bg-orange-50" : "border-gray-200 hover:border-[#B5451B] hover:bg-orange-50/40"}`}
                            >
                                {uploading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#B5451B" }} />
                                ) : (
                                    <>
                                        <ImageIcon className="w-5 h-5 text-gray-300" />
                                        <p className="text-[10px] text-gray-400 text-center leading-tight px-1">Click or drop</p>
                                    </>
                                )}
                            </div>
                        )}
                        <div className="text-xs text-gray-400 pt-1 space-y-0.5">
                            <p className="font-medium text-gray-500">Upload a profile photo</p>
                            <p>PNG, JPG, WEBP supported</p>
                            <p>Max size: ~200 KB (auto-compressed)</p>
                            {uploading && (
                                <p className="text-[#B5451B] flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Text fields */}
                <div className="space-y-4">
                    <div>
                        <label className="label">Username</label>
                        <input className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your_username" />
                    </div>
                    <div>
                        <label className="label">Email <span className="text-gray-400 font-normal">(read only)</span></label>
                        <input className="input-field bg-gray-50 text-gray-400 cursor-not-allowed" value={profile?.email || ""} readOnly />
                    </div>
                    <div>
                        <label className="label">Contact Number</label>
                        <input className="input-field" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="+880 1700 000000" />
                    </div>
                    <div>
                        <label className="label">Address</label>
                        <input className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dhaka, Bangladesh" />
                    </div>
                </div>

                <div className="flex justify-end mt-5">
                    <Button
                        disabled={saving || uploading}
                        onClick={handleSaveProfile}
                        className="rounded-xl text-white px-6"
                        style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)" }}
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1.5" />Save Changes</>}
                    </Button>
                </div>
            </Section>

            {/* ── Change Password Section ───────────────────────────────────── */}
            <Section title="Change Password" icon={Lock}>
                <div className="space-y-4">
                    <PasswordInput label="Current Password" value={oldPassword} onChange={setOldPassword} placeholder="Enter current password" />
                    <PasswordInput label="New Password" value={newPassword} onChange={setNewPassword} placeholder="At least 6 characters" />
                    <PasswordInput label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat new password" />

                    {/* Password strength hint */}
                    {newPassword && (
                        <div className="text-xs space-y-1">
                            <p className={newPassword.length >= 6 ? "text-green-600" : "text-gray-400"}>
                                {newPassword.length >= 6 ? "✓" : "○"} At least 6 characters
                            </p>
                            <p className={/[A-Z]/.test(newPassword) ? "text-green-600" : "text-gray-400"}>
                                {/[A-Z]/.test(newPassword) ? "✓" : "○"} Contains uppercase letter
                            </p>
                            <p className={/[0-9]/.test(newPassword) ? "text-green-600" : "text-gray-400"}>
                                {/[0-9]/.test(newPassword) ? "✓" : "○"} Contains a number
                            </p>
                            {confirmPassword && (
                                <p className={newPassword === confirmPassword ? "text-green-600" : "text-red-500"}>
                                    {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-5">
                    <Button
                        disabled={changingPw}
                        onClick={handleChangePassword}
                        className="rounded-xl text-white px-6"
                        style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)" }}
                    >
                        {changingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Lock className="w-4 h-4 mr-1.5" />Change Password</>}
                    </Button>
                </div>
            </Section>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Lock, Loader2, Check, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useChangePasswordMutation } from "@/redux/api/userApi";
import { removeUser } from "@/services/auth.services";
import { useRouter } from "next/navigation";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function PasswordInput({ label, value, onChange, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{label}</label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#B5451B] transition-colors pr-10"
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

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const router = useRouter();
    const [changePasswordMutation, { isLoading: changingPw }] = useChangePasswordMutation();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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
            setTimeout(() => {
                removeUser();
                router.push("/login");
            }, 1500);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to change password.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-[#B5451B]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
                            <p className="text-xs text-gray-400">Keep your account secure</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <PasswordInput label="Current Password" value={oldPassword} onChange={setOldPassword} placeholder="Enter current password" />
                    <PasswordInput label="New Password" value={newPassword} onChange={setNewPassword} placeholder="At least 6 characters" />
                    <PasswordInput label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat new password" />

                    {newPassword && (
                        <div className="text-[10px] space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                            <p className={newPassword.length >= 6 ? "text-green-600 font-semibold" : "text-gray-400"}>
                                {newPassword.length >= 6 ? "✓" : "○"} At least 6 characters
                            </p>
                            <p className={/[A-Z]/.test(newPassword) ? "text-green-600 font-semibold" : "text-gray-400"}>
                                {/[A-Z]/.test(newPassword) ? "✓" : "○"} Contains uppercase letter
                            </p>
                            {confirmPassword && (
                                <p className={newPassword === confirmPassword ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                                    {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50 flex gap-3">
                    <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl">Cancel</Button>
                    <Button
                        disabled={changingPw}
                        onClick={handleChangePassword}
                        className="flex-1 rounded-xl text-white font-bold"
                        style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)" }}
                    >
                        {changingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Lock className="w-4 h-4 mr-1.5" />Update</>}
                    </Button>
                </div>
            </div>
        </div>
    );
}

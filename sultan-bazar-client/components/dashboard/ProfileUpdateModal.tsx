"use client";

import { useState, useRef, useEffect } from "react";
import { User, Camera, Loader2, Check, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { uploadToImgBB } from "@/helpers/imgbb.uploads";
import { useUpdateProfileMutation } from "@/redux/api/userApi";

interface ProfileUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: any;
}

export function ProfileUpdateModal({ isOpen, onClose, profile }: ProfileUpdateModalProps) {
    const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();

    const [username, setUsername] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (profile) {
            setUsername(profile.username || "");
            setContactNumber(profile.contactNumber || "");
            setProfilePicture(profile.profilePicture || "");
        }
    }, [profile, isOpen]);

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

    const handleSaveProfile = async () => {
        try {
            const payload: Record<string, string> = {};
            if (username !== (profile?.username || "")) payload.username = username;
            if (contactNumber !== (profile?.contactNumber || "")) payload.contactNumber = contactNumber;
            if (profilePicture !== (profile?.profilePicture || "")) payload.profilePicture = profilePicture;

            if (Object.keys(payload).length === 0) {
                toast.info("No changes to save.");
                return;
            }
            await updateProfile(payload).unwrap();
            toast.success("Profile updated successfully!");
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update profile.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-[#B5451B]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Update Profile</h2>
                            <p className="text-xs text-gray-400">Manage your basic info</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Profile picture upload */}
                    <div className="flex flex-col items-center gap-4 py-2">
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                        }} />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative group w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 cursor-pointer hover:border-[#B5451B] transition-all flex items-center justify-center bg-gray-50"
                        >
                            {profilePicture ? (
                                <Image src={profilePicture} alt="Profile" fill className="object-cover" />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <ImageIcon className="w-6 h-6 text-gray-300" />
                                    <span className="text-[10px] text-gray-400 mt-1 font-medium">Upload photo</span>
                                </div>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-[#B5451B]" />
                                </div>
                            )}
                            {!uploading && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Username</label>
                            <input
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#B5451B] transition-colors"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="your_username"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Contact Number</label>
                            <input
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#B5451B] transition-colors"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                placeholder="+880 1700 000000"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 flex gap-3">
                    <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl">Cancel</Button>
                    <Button
                        disabled={saving || uploading}
                        onClick={handleSaveProfile}
                        className="flex-1 rounded-xl text-white font-bold"
                        style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)" }}
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1.5" />Update</>}
                    </Button>
                </div>
            </div>
        </div>
    );
}

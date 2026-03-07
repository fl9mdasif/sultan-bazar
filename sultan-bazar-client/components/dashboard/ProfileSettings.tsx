"use client";

import { useState } from "react";
import { useGetMyProfileQuery } from "@/redux/api/userApi";
import { User, Lock, MapPin, Loader2, ChevronRight, Mail, Phone, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { ProfileUpdateModal } from "./ProfileUpdateModal";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { AddressModal } from "./AddressModal";

const ROLE_STYLES: Record<string, string> = {
    user: "bg-gray-100 text-gray-600",
    admin: "bg-blue-100 text-blue-700",
    superAdmin: "bg-purple-100 text-purple-700",
};

export default function ProfileSettings() {
    const { data: profileData, isLoading } = useGetMyProfileQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const profile = profileData;

    // Modal states
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

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
                <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage your personal information and security</p>
            </div>

            {/* Profile Hero Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-[#B5451B] to-[#D4860A] w-full" />
                <div className="px-6 pb-6 -mt-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-3xl border-4 border-white overflow-hidden bg-gray-100 shadow-md relative">
                        {profile?.profilePicture ? (
                            <Image src={profile.profilePicture} alt="Profile" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#B5451B]">
                                {(profile?.username || "U").charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <h2 className="text-xl font-bold text-gray-900">{profile?.username}</h2>
                        <p className="text-sm text-gray-400">{profile?.email}</p>
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full mt-2 inline-block uppercase tracking-wider ${ROLE_STYLES[profile?.role || "user"]}`}>
                            {profile?.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-4">
                {/* Profile Update */}
                <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="w-full text-left bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all group flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                            <User className="w-6 h-6 text-[#B5451B]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Personal Information</h3>
                            <p className="text-xs text-gray-400">Update username, phone and photo</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#B5451B] group-hover:translate-x-1 transition-all" />
                </button>

                {/* Shipping Address */}
                <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="w-full text-left bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all group flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Shipping Address</h3>
                            <p className="text-xs text-gray-400 truncate max-w-[200px] sm:max-w-xs">{profile?.address || "Add a delivery address"}</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#B5451B] group-hover:translate-x-1 transition-all" />
                </button>

                {/* Change Password */}
                <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="w-full text-left bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all group flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                            <Lock className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Login & Security</h3>
                            <p className="text-xs text-gray-400">Manage your password and security</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#B5451B] group-hover:translate-x-1 transition-all" />
                </button>
            </div>

            {/* Info Badges */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Status</p>
                        <p className="text-xs font-semibold text-gray-700 truncate">Verified</p>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                        <p className="text-xs font-semibold text-gray-700 truncate">{profile?.contactNumber || "Not added"}</p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ProfileUpdateModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                profile={profile}
            />
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                currentAddress={profile?.address || ""}
            />
        </div>
    );
}

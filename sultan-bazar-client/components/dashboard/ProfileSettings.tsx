"use client";

import { useState } from "react";
import { useGetMyProfileQuery, useGetAddressesQuery, useDeleteAddressMutation } from "@/redux/api/userApi";
import { User, Lock, MapPin, Loader2, ChevronRight, Mail, Phone, ShieldCheck, Trash2, Edit2, Home, Briefcase } from "lucide-react";
import Image from "next/image";
import { ProfileUpdateModal } from "./ProfileUpdateModal";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { AddressModal } from "./AddressModal";
import { TSavedAddress } from "@/types/common";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
    const [addressToEdit, setAddressToEdit] = useState<TSavedAddress | undefined>(undefined);

    const { data: addressesData, isLoading: addressesLoading } = useGetAddressesQuery(undefined);
    const [deleteAddress] = useDeleteAddressMutation();

    // console.log(addressesData);
    const addresses = addressesData as any || [];

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

                {/* Shipping Addresses Section */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 leading-none mb-1">Shipping Addresses</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Manage where we deliver</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => { setAddressToEdit(undefined); setIsAddressModalOpen(true); }}
                            variant="ghost"
                            className="text-[#B5451B] hover:bg-orange-50 font-bold rounded-xl h-9"
                        >
                            Add New
                        </Button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {addresses.length > 0 ? (
                            addresses.map((addr: TSavedAddress) => {
                                const LabelIcon = addr.label === "Home" ? Home : addr.label === "Office" ? Briefcase : MapPin;
                                return (
                                    <div key={addr._id} className="p-5 flex items-start justify-between group hover:bg-gray-50 transition-all">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center bg-white group-hover:border-orange-200 group-hover:shadow-sm transition-all">
                                                <LabelIcon className="w-5 h-5 text-gray-400 group-hover:text-[#B5451B]" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-gray-900 text-sm tracking-tight">{addr.fullName}</span>
                                                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 tracking-widest">{addr.label}</span>
                                                    {addr.isDefault && <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 text-[#B5451B] tracking-widest">Default</span>}
                                                </div>
                                                <p className="text-xs text-gray-400 font-medium mb-1">{addr.phone}</p>
                                                <p className="text-xs text-gray-500 leading-relaxed max-w-[250px]">{addr.address}, {addr.city}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <Button
                                                onClick={() => { setAddressToEdit(addr); setIsAddressModalOpen(true); }}
                                                variant="ghost"
                                                className="p-2 h-9 w-9 rounded-xl hover:bg-orange-50 text-gray-400 hover:text-[#B5451B]"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                onClick={async () => {
                                                    if (confirm("Are you sure you want to delete this address?")) {
                                                        try {
                                                            await deleteAddress(addr._id!).unwrap();
                                                            toast.success("Address deleted");
                                                        } catch (e) {
                                                            toast.error("Failed to delete address");
                                                        }
                                                    }
                                                }}
                                                variant="ghost"
                                                className="p-2 h-9 w-9 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-10 text-center">
                                <p className="text-sm text-gray-400 font-medium">No saved addresses found.</p>
                            </div>
                        )}
                    </div>
                </div>

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
                addressToEdit={addressToEdit}
            />
        </div>
    );
}

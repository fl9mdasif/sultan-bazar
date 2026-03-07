"use client";

import { useState, useEffect } from "react";
import { MapPin, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUpdateProfileMutation } from "@/redux/api/userApi";

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentAddress: string;
}

export function AddressModal({ isOpen, onClose, currentAddress }: AddressModalProps) {
    const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
    const [address, setAddress] = useState("");

    useEffect(() => {
        setAddress(currentAddress || "");
    }, [currentAddress, isOpen]);

    const handleSaveAddress = async () => {
        if (!address.trim()) {
            toast.error("Address cannot be empty.");
            return;
        }
        try {
            await updateProfile({ address }).unwrap();
            toast.success("Shipping address updated!");
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update address.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-[#B5451B]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
                            <p className="text-xs text-gray-400">Where we deliver your goodies</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-6">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Full Address</label>
                    <textarea
                        rows={4}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#B5451B] transition-colors resize-none"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. House 26, Road 03, PC culture housing societ, Mohammedpur, Dhaka 1216"
                    />
                </div>

                <div className="p-6 bg-gray-50 flex gap-3">
                    <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl">Cancel</Button>
                    <Button
                        disabled={saving}
                        onClick={handleSaveAddress}
                        className="flex-1 rounded-xl text-white font-bold"
                        style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)" }}
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1.5" />Save Address</>}
                    </Button>
                </div>
            </div>
        </div>
    );
}

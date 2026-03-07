"use client";

import { useState, useEffect } from "react";
import { MapPin, Loader2, Check, X, Home, Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAddAddressMutation, useUpdateAddressMutation } from "@/redux/api/userApi";
import { TSavedAddress } from "@/types/common";

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    addressToEdit?: TSavedAddress;
}

const LABELS = ["Home", "Office", "Other"];

export function AddressModal({ isOpen, onClose, addressToEdit }: AddressModalProps) {
    const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
    const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

    const [formData, setFormData] = useState<Partial<TSavedAddress>>({
        label: "Home",
        fullName: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        postalCode: "",
        country: "Bangladesh",
        isDefault: false
    });

    useEffect(() => {
        if (addressToEdit) {
            setFormData(addressToEdit);
        } else {
            setFormData({
                label: "Home",
                fullName: "",
                phone: "",
                address: "",
                city: "",
                district: "",
                postalCode: "",
                country: "Bangladesh",
                isDefault: false
            });
        }
    }, [addressToEdit, isOpen]);

    const handleSaveAddress = async () => {
        if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.district) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            if (addressToEdit?._id) {
                await updateAddress({ id: addressToEdit._id, data: formData }).unwrap();
                toast.success("Address updated successfully!");
            } else {
                await addAddress(formData as TSavedAddress).unwrap();
                toast.success("Address added successfully!");
            }
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to save address.");
        }
    };

    if (!isOpen) return null;

    const isLoading = isAdding || isUpdating;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-orange-100">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50/50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shadow-inner">
                            <MapPin className="w-6 h-6 text-[#B5451B]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 leading-none mb-1">
                                {addressToEdit ? "Edit Address" : "Add New Address"}
                            </h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                {addressToEdit ? "Update your delivery details" : "Where should we send your goodies?"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-orange-50 rounded-xl transition-all hover:rotate-90">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                    {/* Label Selection */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Address Label</label>
                        <div className="flex gap-3">
                            {LABELS.map((label) => {
                                const Icon = label === "Home" ? Home : label === "Office" ? Briefcase : MapPin;
                                const isSelected = formData.label === label;
                                return (
                                    <button
                                        key={label}
                                        onClick={() => setFormData({ ...formData, label })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-sm ${isSelected
                                                ? "border-[#B5451B] bg-orange-50 text-[#B5451B] shadow-md shadow-orange-100"
                                                : "border-gray-100 text-gray-400 hover:border-orange-200"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Receiver Name *</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-[#B5451B] focus:bg-white transition-all shadow-sm"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="e.g. Asif Ahmed"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Phone Number *</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-[#B5451B] focus:bg-white transition-all shadow-sm"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="017XXXXXXXX"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Street Address *</label>
                        <textarea
                            rows={2}
                            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-[#B5451B] focus:bg-white transition-all shadow-sm resize-none"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="House, Road, Area..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">City *</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-[#B5451B] focus:bg-white transition-all shadow-sm"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="e.g. Dhaka"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">District *</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-semibold outline-none focus:border-[#B5451B] focus:bg-white transition-all shadow-sm"
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                placeholder="e.g. Dhaka"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-orange-50/30 p-4 rounded-xl border border-orange-100">
                        <input
                            type="checkbox"
                            id="isDefault"
                            className="w-5 h-5 accent-[#B5451B] rounded-lg cursor-pointer"
                            checked={formData.isDefault}
                            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        />
                        <label htmlFor="isDefault" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                            Set as default shipping address
                        </label>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50/80 backdrop-blur-sm border-t border-gray-100 flex gap-4">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1 rounded-2xl h-12 font-bold text-gray-500 hover:bg-white transition-all border-gray-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleSaveAddress}
                        className="flex-1 rounded-2xl h-12 text-white font-black shadow-lg hover:shadow-orange-200 transition-all active:scale-95"
                        style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)" }}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-2">
                                {addressToEdit ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                {addressToEdit ? "Update Address" : "Save Address"}
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

import httpStatus from 'http-status';
import { User } from '../auth/model.auth';
import { TSavedAddress } from '../auth/interface.auth';
import AppError from '../../errors/AppErrors';

const MAX_SAVED_ADDRESSES = 5;

// ── Get all saved addresses ────────────────────────────────────────────────────
const getAddresses = async (userId: string) => {
    const user = await User.findById(userId).select('savedAddresses');
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found', 'User not found');
    return user.savedAddresses ?? [];
};

// ── Auto-save address after order placement ───────────────────────────────────
// Called internally from the order service.  Does NOT throw — failures are silent
// so they never block an already-successful order.
const autoSaveAddressFromOrder = async (
    userId: string,
    incoming: TSavedAddress,
) => {
    try {
        const user = await User.findById(userId).select('savedAddresses');
        if (!user) return;

        const existing = user.savedAddresses ?? [];

        // Check for exact duplicate (same address + phone) — don't save twice
        const isDuplicate = existing.some(
            (a) => a.address === incoming.address && a.phone === incoming.phone,
        );
        if (isDuplicate) return;

        // If limit reached, drop the oldest non-default entry
        if (existing.length >= MAX_SAVED_ADDRESSES) {
            const oldestIndex = existing.findIndex((a) => !a.isDefault);
            if (oldestIndex !== -1) {
                existing.splice(oldestIndex, 1);
            } else {
                return; // all are default — respect user's choices
            }
        }

        // First address? Make it default automatically
        const makeDefault = existing.length === 0;

        await User.findByIdAndUpdate(userId, {
            $push: {
                savedAddresses: { ...incoming, isDefault: makeDefault },
            },
        });
    } catch {
        // silent — do not break the order flow
    }
};

// ── Add address manually ───────────────────────────────────────────────────────
const addAddress = async (userId: string, data: TSavedAddress) => {
    const user = await User.findById(userId).select('savedAddresses');
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found', 'User not found');

    const existing = user.savedAddresses ?? [];

    if (existing.length >= MAX_SAVED_ADDRESSES) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Maximum ${MAX_SAVED_ADDRESSES} addresses allowed`,
            'Address limit reached',
        );
    }

    // If this is set as default, clear others first
    if (data.isDefault) {
        await User.updateOne(
            { _id: userId },
            { $set: { 'savedAddresses.$[].isDefault': false } },
        );
    }

    // Auto-default if it's the first address
    const isDefault = existing.length === 0 ? true : (data.isDefault ?? false);

    const updated = await User.findByIdAndUpdate(
        userId,
        { $push: { savedAddresses: { ...data, isDefault } } },
        { new: true, select: 'savedAddresses' },
    );

    return updated?.savedAddresses;
};

// ── Update a specific address ──────────────────────────────────────────────────
const updateAddress = async (
    userId: string,
    addressId: string,
    data: Partial<TSavedAddress>,
) => {
    // If marking as default, unset all others first
    if (data.isDefault) {
        await User.updateOne(
            { _id: userId },
            { $set: { 'savedAddresses.$[].isDefault': false } },
        );
    }

    const result = await User.findOneAndUpdate(
        { _id: userId, 'savedAddresses._id': addressId },
        {
            $set: Object.fromEntries(
                Object.entries(data).map(([k, v]) => [`savedAddresses.$.${k}`, v]),
            ),
        },
        { new: true, select: 'savedAddresses' },
    );

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Address not found', 'Address not found');
    }

    return result.savedAddresses;
};

// ── Delete a specific address ──────────────────────────────────────────────────
const deleteAddress = async (userId: string, addressId: string) => {
    const result = await User.findByIdAndUpdate(
        userId,
        { $pull: { savedAddresses: { _id: addressId } } },
        { new: true, select: 'savedAddresses' },
    );

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found', 'User not found');
    }

    return result.savedAddresses;
};

// ── Set default address ────────────────────────────────────────────────────────
const setDefaultAddress = async (userId: string, addressId: string) => {
    // Unset all
    await User.updateOne(
        { _id: userId },
        { $set: { 'savedAddresses.$[].isDefault': false } },
    );
    // Set the chosen one
    const result = await User.findOneAndUpdate(
        { _id: userId, 'savedAddresses._id': addressId },
        { $set: { 'savedAddresses.$.isDefault': true } },
        { new: true, select: 'savedAddresses' },
    );

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Address not found', 'Address not found');
    }

    return result.savedAddresses;
};

export const userServices = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    autoSaveAddressFromOrder,   // exported so order service can call it
};

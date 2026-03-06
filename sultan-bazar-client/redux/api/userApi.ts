import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const userApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // ── Profile (all authenticated users) ─────────────────────────────────

        // GET /users/me
        getMyProfile: build.query({
            query: () => ({ url: "/users/me", method: "GET" }),
            providesTags: [tagTypes.users],
        }),

        // PATCH /users/me
        updateProfile: build.mutation({
            query: (data) => ({ url: "/users/me", method: "PATCH", data }),
            invalidatesTags: [tagTypes.users],
        }),

        // POST /users/me/change-password
        changePassword: build.mutation({
            query: (data: { oldPassword: string; newPassword: string }) => ({
                url: "/users/me/change-password",
                method: "POST",
                data,
            }),
        }),

        // ── Admin / Superadmin user management ────────────────────────────────

        // GET all users (admin/superAdmin)
        getAllUsers: build.query({
            query: (params) => ({ url: "/users", method: "GET", params }),
            providesTags: [tagTypes.users],
        }),

        // PATCH user role (superAdmin)
        updateUserRole: build.mutation({
            query: ({ id, role }) => ({
                url: `/users/${id}/role`,
                method: "PATCH",
                data: { role },
            }),
            invalidatesTags: [tagTypes.users],
        }),

        // PATCH block/unblock user (superAdmin)
        toggleBlockUser: build.mutation({
            query: (id: string) => ({
                url: `/users/${id}/block`,
                method: "PATCH",
            }),
            invalidatesTags: [tagTypes.users],
        }),

        // DELETE user (superAdmin)
        deleteUser: build.mutation({
            query: (id: string) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.users],
        }),
    }),
});

export const {
    useGetMyProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useGetAllUsersQuery,
    useUpdateUserRoleMutation,
    useToggleBlockUserMutation,
    useDeleteUserMutation,
} = userApi;

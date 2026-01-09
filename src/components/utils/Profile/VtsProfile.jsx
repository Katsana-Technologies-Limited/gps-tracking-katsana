import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useAxios } from "../../../hooks/useAxios";
import useCustomer from "../../../hooks/useCustomer";

const VtsProfile = () => {
  const axiosUrl = useAxios();
  const { data, isLoading, error } = useCustomer()

  const [showChangePass, setShowChangePass] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const mutation = useMutation({
    mutationFn: async (data) => {
      return axiosUrl.put("/api/vts/auth/change-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      reset();
      setShowChangePass(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to change password");
    },
  });

  const onSubmit = (formData) => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="p-6">Loading profile...</div>;
  if (error)
    return <div className="p-6 text-red-500">Failed to load profile</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8 mt-6">
      <h2 className="text-2xl font-bold text-[#2c5364] mb-6">My Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <ProfileField label="Company" value={data?.company} />
        <ProfileField label="Email" value={data?.email} />
        <ProfileField label="Mobile" value={data?.mobile} />
        <ProfileField label="Nationality" value={data?.nationality} />
        <ProfileField label="National ID" value={data?.national_id} />
        <ProfileField label="Occupation" value={data?.occupation} />
        <ProfileField label="City" value={data?.city} />
        <ProfileField label="Country" value={data?.country} />
        <ProfileField
          label="Permanent Address"
          value={data?.permanent_address}
        />
        <ProfileField label="Present Address" value={data?.present_address} />
        <ProfileField label="ZIP" value={data?.zip} />
        <ProfileField label="Website" value={data?.website} />
        <ProfileField
          label="Created At"
          value={data?.created_at && new Date(data.created_at).toLocaleString()}
        />
        <ProfileField
          label="Updated At"
          value={data?.updated_at && new Date(data.updated_at).toLocaleString()}
        />
      </div>
      <div className="flex justify-end">
        <button
          className="bg-[#fe8e1c] cursor-pointer text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-[#e07c13] transition"
          onClick={() => setShowChangePass(true)}
        >
          Change Password
        </button>
      </div>
      {showChangePass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute cursor-pointer top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setShowChangePass(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold text-[#2c5364] mb-4">
              Change Password
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Old Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-[#fe8e1c]"
                  autoComplete="current-password"
                  {...register("oldPassword", {
                    required: "Old password is required",
                  })}
                />
                {errors.oldPassword && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.oldPassword.message}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-[#fe8e1c]"
                  autoComplete="new-password"
                  {...register("newPassword", {
                    required: "New password is required",
                  })}
                />
                {errors.newPassword && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.newPassword.message}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-[#fe8e1c]"
                  autoComplete="new-password"
                  {...register("confirmPassword", {
                    required: "Please confirm new password",
                  })}
                />
                {errors.confirmPassword && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#fe8e1c] cursor-pointer text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-[#e07c13] transition"
                  disabled={isSubmitting || mutation.isLoading}
                >
                  {mutation.isLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function ProfileField({ label, value }) {
    return (
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="font-semibold text-lg text-[#2c5364]">
          {value || "-"}
        </div>
      </div>
    );
  }
};

export default VtsProfile;

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAxios } from "../../hooks/useAxios";
import { toast } from "sonner";

const VtsProfile = () => {
  const axiosUrl = useAxios();
  const { data, isLoading, error } = useQuery({
    queryKey: ["vtsProfile"],
    queryFn: async () => {
      const res = await axiosUrl.get("/api/vts/auth/profile");
      return res.data.profile;
    },
  });
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: async ({ oldPassword, newPassword }) => {
      return axiosUrl.put("/api/vts/auth/change-password", {
        oldPassword,
        newPassword,
      });
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to change password");
    },
  });

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    mutation.mutate({ oldPassword, newPassword });
  };

  if (isLoading) return <div className="p-6">Loading profile...</div>;
  if (error)
    return <div className="p-6 text-red-500">Failed to load profile</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8 mt-6">
      <h2 className="text-2xl font-bold text-[#2c5364] mb-6">My Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <div className="text-sm text-gray-500">Name</div>
          <div className="font-semibold text-lg text-[#2c5364]">
            {data?.company || "-"}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Email</div>
          <div className="font-semibold text-lg text-[#2c5364]">
            {data?.email || "-"}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Mobile</div>
          <div className="font-semibold text-lg text-[#2c5364]">
            {data?.mobile || "-"}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Nationality</div>
          <div className="font-semibold text-lg text-[#2c5364]">
            {data?.nationality || "-"}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">City</div>
          <div className="font-semibold text-lg text-[#2c5364]">
            {data?.city || "-"}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Country</div>
          <div className="font-semibold text-lg text-[#2c5364]">
            {data?.country || "-"}
          </div>
        </div>
      </div>
      <hr className="my-6" />
      <h3 className="text-xl font-semibold text-[#2c5364] mb-4">
        Change Password
      </h3>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={handleChangePassword}
      >
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Old Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe8e1c]"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe8e1c]"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe8e1c]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="col-span-2 mt-2">
          <button
            type="submit"
            className="bg-[#fe8e1c] text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-[#e07c13] transition"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VtsProfile;

import React from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiBook,
  FiBriefcase,
  FiAward,
  FiShield,
  FiLogOut,
  FiArrowLeft,
} from "react-icons/fi";
import { useAuthContext } from "../../context/auth/useAuthContext";
import type { IFaculty } from "../../@types/interface/faculty.interface";
import { Link } from "react-router";
import useDashboardContext from "../../context/dashboard/useDashboardContext";

const MyProfilePage: React.FC = () => {
  const { onLogout, user, isLoading } = useAuthContext();
  const { setPageName } = useDashboardContext();
  const profile = user as IFaculty | null;

  React.useEffect(() => {
    setPageName("My Profile");
  }, [setPageName]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Profile not found
          </h2>
          <p className="text-gray-500 mt-2">Please log in again.</p>
          <button
            onClick={onLogout}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${profile.first_name} ${
    profile.middle_name ? profile.middle_name + " " : ""
  }${profile.last_name}`;

  return (
    <div className="w-full p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md">
            <FiEdit className="w-4 h-4" />
            Edit Profile
          </button> */}
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                {profile.profile_picture_url ? (
                  <img
                    src={profile.profile_picture_url}
                    alt={fullName}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {profile.first_name.charAt(0).toUpperCase()}
                      {profile.last_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 md:mt-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {fullName}
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">
                      {profile.designation}
                    </p>
                    <p className="text-md text-gray-500">
                      {profile.department}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                    {profile.role && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {profile.role}
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        profile.account_status === false
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {profile.account_status === false ? "Inactive" : "Active"}
                    </span>
                  </div>
                </div>
                {profile.faculty_id && (
                  <p className="text-sm text-gray-500 mt-2">
                    Faculty ID: {profile.faculty_id}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiUser className="w-5 h-5 text-blue-600" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiCalendar className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </p>
                  <p className="text-gray-900">{formatDate(profile.dob)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMail className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Email Address
                  </p>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Phone Number
                  </p>
                  <p className="text-gray-900">{profile.phone_number}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiBriefcase className="w-5 h-5 text-blue-600" />
              Professional Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiBook className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Qualification
                  </p>
                  <p className="text-gray-900">{profile.qualification}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiAward className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Experience
                  </p>
                  <p className="text-gray-900">{profile.experience}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiCalendar className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Joining Date
                  </p>
                  <p className="text-gray-900">
                    {formatDate(profile.joining_date)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Address */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiMapPin className="w-5 h-5 text-blue-600" />
              Current Address
            </h2>
            <div className="text-gray-700 space-y-1">
              <p className="font-medium">{profile.current_address.address}</p>
              <p>
                {profile.current_address.district},{" "}
                {profile.current_address.state}
              </p>
              <p>
                {profile.current_address.country} -{" "}
                {profile.current_address.pincode}
              </p>
            </div>
          </div>

          {/* Permanent Address */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiMapPin className="w-5 h-5 text-green-600" />
              Permanent Address
            </h2>
            <div className="text-gray-700 space-y-1">
              <p className="font-medium">{profile.permanent_address.address}</p>
              <p>
                {profile.permanent_address.district},{" "}
                {profile.permanent_address.state}
              </p>
              <p>
                {profile.permanent_address.country} -{" "}
                {profile.permanent_address.pincode}
              </p>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiShield className="w-5 h-5 text-blue-600" />
              Permissions & Access
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Notice Permission
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.notice_permission
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {profile.notice_permission ? "Granted" : "Not Granted"}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Event Permission
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.event_permission
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {profile.event_permission ? "Granted" : "Not Granted"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg font-medium"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;

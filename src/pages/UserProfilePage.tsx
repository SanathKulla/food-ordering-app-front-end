import { useGetMyUser, useUpdateMyUser } from "../api/MyUserApi";
import UserProfileForm from "../forms/user-profile-form/UserProfileForm";

const UserProfilePage = () => {
  const { currentUser, isLoading: isGetLoading } = useGetMyUser();
  const { updateUser, isLoading: isUpdateLoading } = useUpdateMyUser();
  if (isGetLoading) {
    return (
      <span className="text-xl font-bold ">
        Please wait while Loading User Profile...
      </span>
    );
  }

  if (!currentUser) {
    return (
      <span className="text-xl font-bold ">Unable to load user profile</span>
    );
  }
  return (
    <UserProfileForm
      currentUser={currentUser}
      onSave={updateUser}
      isLoading={isUpdateLoading}
    />
  );
};

export default UserProfilePage;

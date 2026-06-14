import { getUser } from "@/utils/apis";
import ProfileForm from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) return null;

  return <ProfileForm user={user} />;
}

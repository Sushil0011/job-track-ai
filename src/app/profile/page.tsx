import { Suspense } from "react";
import { getUser } from "@/utils/apis";
import ProfileForm from "@/components/profile/profile-form";

async function ProfilePageContent() {
  const user = await getUser();
  if (!user) return null;

  return <ProfileForm user={user} />;
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfilePageContent />
    </Suspense>
  );
}

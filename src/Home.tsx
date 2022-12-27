import { useProfile } from "./queries/profile";

export function Home() {
  const { profile, isLoading, error } = useProfile();

  if (isLoading) {
    return <p>Loading</p>;
  }

  if (error) {
    return <p>Error</p>;
  }

  return (
    <p>Hello {profile?.username}</p>
  );
};

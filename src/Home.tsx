import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useProfile } from "./queries/profile";

export function Home() {
  const { profile, isLoading, error } = useProfile();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography>Error</Typography>;
  }

  return (
    <Typography>Hello {profile?.username}</Typography>
  );
};

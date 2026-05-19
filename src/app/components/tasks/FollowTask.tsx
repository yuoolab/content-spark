import { Navigate } from 'react-router';

export function FollowTask() {
  return <Navigate to="/backend/tasks/create?scene=follow" replace />;
}

import { RouterProvider } from 'react-router';
import { router } from './routes';
import { UserH5Provider } from './user-h5/state';

export default function App() {
  return (
    <UserH5Provider>
      <RouterProvider router={router} />
    </UserH5Provider>
  );
}

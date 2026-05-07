import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { UserH5Provider } from './user-h5/state';

export default function App() {
  return (
    <UserH5Provider>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        offset="42vh"
        richColors
        toastOptions={{
          style: {
            borderRadius: 16,
            fontWeight: 700,
            padding: '10px 14px',
            width: 'fit-content',
            minWidth: 0,
            maxWidth: '140px',
          },
        }}
      />
    </UserH5Provider>
  );
}

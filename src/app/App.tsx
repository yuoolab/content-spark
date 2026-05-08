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
        offset="38vh"
        richColors
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(calc(100vw - 20px), 500px)",
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
        toastOptions={{
          style: {
            borderRadius: 16,
            fontWeight: 700,
            padding: '10px 14px',
            width: 'fit-content',
            minWidth: 0,
            maxWidth: '220px',
            pointerEvents: "auto",
          },
        }}
      />
    </UserH5Provider>
  );
}

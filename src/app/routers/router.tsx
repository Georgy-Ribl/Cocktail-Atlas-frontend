import { Navigate, createBrowserRouter } from 'react-router-dom';

import { HomePage, Layout, RecipeDetailsPage } from '@/pages';
import { ROUTES_NAMES } from './types';

export const createRoutes = () => {
  return createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: ROUTES_NAMES.HOME,
          element: <HomePage />,
        },
        {
          path: ROUTES_NAMES.RECIPE_DETAILS,
          element: <RecipeDetailsPage />,
        },
        {
          path: '*',
          element: <Navigate to={'/'} />,
        },
      ],
    },
  ]);
};

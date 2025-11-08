import HomePage from './pages/HomePage';
import CreateStoryPage from './pages/CreateStoryPage';
import LibraryPage from './pages/LibraryPage';
import StorybookViewerPage from './pages/StorybookViewerPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />
  },
  {
    name: 'Create Story',
    path: '/create',
    element: <CreateStoryPage />
  },
  {
    name: 'Library',
    path: '/library',
    element: <LibraryPage />
  },
  {
    name: 'Storybook Viewer',
    path: '/storybook/:id',
    element: <StorybookViewerPage />
  }
];

export default routes;
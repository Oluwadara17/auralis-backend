import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ApplyPage from './pages/ApplyPage.jsx';
import CohortPage from './pages/CohortPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import HomePage from './pages/HomePage.jsx';
import JournalDetailPage from './pages/JournalDetailPage.jsx';
import JournalsPage from './pages/JournalsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import TracksPage from './pages/TracksPage.jsx';
import VolunteerPage from './pages/VolunteerPage.jsx';

const adminEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_ADMIN === 'true';
const AdminPage = adminEnabled ? lazy(() => import('./pages/AdminPage.jsx')) : null;

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="tracks" element={<TracksPage />} />
        <Route path="cohort" element={<CohortPage />} />
        <Route path="apply" element={<ApplyPage />} />
        <Route path="journals" element={<JournalsPage />} />
        <Route path="journals/:id" element={<JournalDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="volunteer" element={<VolunteerPage />} />
        {adminEnabled && AdminPage ? (
          <Route
            path="admin"
            element={
              <Suspense fallback={<p className="status">Loading admin tools...</p>}>
                <AdminPage />
              </Suspense>
            }
          />
        ) : null}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

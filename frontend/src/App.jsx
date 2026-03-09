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
import AdminPage from './pages/AdminPage.jsx';
import VolunteerPage from './pages/VolunteerPage.jsx';

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
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

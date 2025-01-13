import styles from './logout.module.css';
import { useAuth } from '~/contexts/auth/useAuth';
import fbAuth from '~/firebase/firebaseConfig';

export default function Logout() {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await fbAuth.signOut(); //effect in logged-wrapper handles the navigation and session
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return <></>;
  }

  return (
    <button
      onClick={handleLogout}
      className={`bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition duration-200 ${styles.logoutButton}`}
    >
      Logout
    </button>
  );
}

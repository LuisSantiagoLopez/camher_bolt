import { useSelectedToolContext } from '@/context/SelectedToolContext';
import { motion } from 'framer-motion';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

export default function NavBar() {
  const { pastTools, setPastTools, setSelectedTool } = useSelectedToolContext();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      router.push('/login');
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    let pastTool = pastTools[0] as string;
    setSelectedTool(pastTool);
    setPastTools(pastTools.slice(1, pastTools.length));
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 bg-camherlightyellow md:shadow-md"
    >
      <div className="px-6 py-6 lg:px-8">
        <nav className="flex items-center justify-between" aria-label="Global">
          <motion.div
            initial={{
              opacity: 0,
              x: -100,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{ duration: 0.3 }}
            className="transition-transform duration-150 ease-in-out hover:scale-125"
          >
            {pastTools.length > 1 && (
              <a onClick={handleClick}>
                <button className="button">
                  <span aria-hidden="true">&larr;</span>
                </button>
              </a>
            )}
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              x: 100,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{ duration: 0.3 }}
            className="transition-transform duration-150 ease-in-out hover:scale-110"
          >
            <button onClick={handleSignOut} className="button">
              <span aria-hidden="true">Cerrar sesión</span>
            </button>
          </motion.div>
        </nav>
      </div>
    </motion.div>
  );
}
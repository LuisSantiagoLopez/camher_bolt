// src/components/ui/Layout/NavBar.tsx

import { useSelectedToolContext } from '@/context/SelectedToolContext';
import { motion } from 'framer-motion';
// Updated: use our custom hook instead of the deprecated package.
import { useSupabaseClient } from '@/utils/supabase/useSupabaseClient';
import { useRouter } from 'next/router';
import React from 'react';

/**
 * NavBar Component
 * 
 * This component provides the navigation bar with:
 * - A left button that cycles through past tools (using SelectedToolContext).
 * - A sign-out button that logs the user out via Supabase and redirects to the login page.
 *
 * It uses Framer Motion for smooth animations.
 */
export default function NavBar() {
  const { pastTools, setPastTools, setSelectedTool } = useSelectedToolContext();
  const supabase = useSupabaseClient();
  const router = useRouter();

  // Handler for signing out the user.
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      // Redirect the user to the login page after a successful sign-out.
      router.push('/login');
    }
  };

  // Handler for clicking the left-arrow link.
  // It uses context to update the currently selected tool.
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pastTools.length > 0) {
      const pastTool = pastTools[0];
      setSelectedTool(pastTool);
      setPastTools(pastTools.slice(1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 bg-camherlightyellow md:shadow-md"
    >
      <div className="px-6 py-6 lg:px-8">
        <nav className="flex items-center justify-between" aria-label="Global">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="transition-transform duration-150 ease-in-out hover:scale-125"
          >
            {pastTools.length > 1 && (
              <a href="#" onClick={handleClick}>
                <button className="button">
                  <span aria-hidden="true">&larr;</span>
                </button>
              </a>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
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

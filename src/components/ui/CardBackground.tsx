import { motion } from 'framer-motion';

export default function CardBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div
        id="card"
        className="mx-auto w-full  rounded-3xl border-[4px] border-camhergreen bg-black p-5 text-white lg:w-[75%]"
      >
        <div id="mainContainer" className="flex h-full w-full flex-col">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

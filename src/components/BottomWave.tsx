import { motion } from 'framer-motion';

export default function BottomWave({ fillColor = "fill-[#F7F6F4]" }: { fillColor?: string }) {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-[15] h-[120px] md:h-[180px] pointer-events-none translate-y-[1px]">
      <motion.div 
        className="absolute top-0 left-0 w-[200%] h-full flex"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`w-[100%] h-full opacity-40 ${fillColor}`}>
           <path d="M0,60 C300,120 600,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`w-[100%] h-full opacity-40 ${fillColor}`}>
           <path d="M0,60 C300,120 600,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </motion.div>

      <motion.div 
        className="absolute top-0 left-0 w-[200%] h-full flex"
        animate={{ x: ["-50%", "0%"] }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`w-[100%] h-full opacity-60 ${fillColor}`}>
           <path d="M0,40 C300,100 600,20 1200,40 L1200,120 L0,120 Z"></path>
        </svg>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`w-[100%] h-full opacity-60 ${fillColor}`}>
           <path d="M0,40 C300,100 600,20 1200,40 L1200,120 L0,120 Z"></path>
        </svg>
      </motion.div>

      <motion.div 
        className="absolute top-0 left-0 w-[200%] h-full flex"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`w-[100%] h-full opacity-100 ${fillColor}`}>
           <path d="M0,80 C300,120 600,40 1200,80 L1200,120 L0,120 Z"></path>
        </svg>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`w-[100%] h-full opacity-100 ${fillColor}`}>
           <path d="M0,80 C300,120 600,40 1200,80 L1200,120 L0,120 Z"></path>
        </svg>
      </motion.div>
    </div>
  );
}

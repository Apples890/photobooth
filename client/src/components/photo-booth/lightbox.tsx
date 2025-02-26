import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Lightbox({ isOpen, onClose, children }: LightboxProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="w-full max-w-4xl mx-4">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { Loader } from 'lucide-react';

export default function LoadingSpinner({ size = 16, className = '' }) {
  return <Loader size={size} className={`animate-spin text-orange-500 ${className}`} />;
}

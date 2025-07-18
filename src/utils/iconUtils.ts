import { 
  Banknote, 
  Calculator, 
  Shield, 
  Heart, 
  FileText, 
  Train,
  BookOpen
} from 'lucide-react';

export const getIconByName = (iconName: string) => {
  const icons: { [key: string]: any } = {
    'Banknote': Banknote,
    'Calculator': Calculator,
    'Shield': Shield,
    'Heart': Heart,
    'FileText': FileText,
    'Train': Train,
    'BookOpen': BookOpen
  };
  
  return icons[iconName] || BookOpen;
};
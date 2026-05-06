import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

interface UserData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  lagnaSign: string;
  lagnaSystem: string;
}

interface UserFormProps {
  onDataChange: (data: UserData) => void;
}

export function UserForm({ onDataChange }: UserFormProps) {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    lagnaSign: 'AUTO',
    lagnaSystem: 'vedic-lahiri'
  });

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Parent will be notified when the user clicks Calculate Numerology

  const handlePredict = () => {
    onDataChange(formData);
  };

  return (
    <div className="bg-white/[0.008] backdrop-blur-2xl rounded-2xl p-5 md:p-8 border border-white/35 shadow-[0_0_0_1px_rgba(255,255,255,0.045)]">
      <h2 className="text-xl md:text-2xl mb-6 text-white/90">Your Cosmic Profile</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white/70">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your name"
            className="bg-white/0 border-white/20 text-white placeholder:text-white/35 focus:border-purple-400/50 focus:ring-purple-500/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob" className="text-white/70">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            className="bg-white/0 border-white/20 text-white placeholder:text-white/35 focus:border-purple-400/50 focus:ring-purple-500/20"
          />
        </div>
        {/* Removed time/place/lagna inputs for numerology-only mode */}

        <Button
          type="button"
          onClick={handlePredict}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-400 hover:to-blue-400"
        >
          Calculate Numerology
        </Button>
      </div>
    </div>
  );
}

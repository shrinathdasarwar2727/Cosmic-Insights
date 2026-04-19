import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface UserData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

interface UserFormProps {
  onDataChange: (data: UserData) => void;
}

export function UserForm({ onDataChange }: UserFormProps) {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: ''
  });

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        <div className="space-y-2">
          <Label htmlFor="tob" className="text-white/70">Time of Birth</Label>
          <Input
            id="tob"
            type="time"
            value={formData.timeOfBirth}
            onChange={(e) => handleChange('timeOfBirth', e.target.value)}
            className="bg-white/0 border-white/20 text-white placeholder:text-white/35 focus:border-purple-400/50 focus:ring-purple-500/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pob" className="text-white/70">Place of Birth</Label>
          <Input
            id="pob"
            value={formData.placeOfBirth}
            onChange={(e) => handleChange('placeOfBirth', e.target.value)}
            placeholder="City, Country"
            className="bg-white/0 border-white/20 text-white placeholder:text-white/35 focus:border-purple-400/50 focus:ring-purple-500/20"
          />
        </div>
      </div>
    </div>
  );
}

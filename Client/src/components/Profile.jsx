import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, Mail, Phone, MapPin, Pencil, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateUser(formData);
    setEditMode(false);
  };

  return (
    <div className="mt-28 min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-col items-center">
          <User className="h-16 w-16 text-blue-600 mb-2" />
          <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="h-4 w-4" /> Name
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" /> Phone
              </label>
              <Input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Address
              </label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-2">
              {editMode ? (
                <>
                  <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                    <X className="h-4 w-4 mr-2" /> Cancel
                  </Button>
                  <Button type="button" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" /> Save
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setEditMode(true)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
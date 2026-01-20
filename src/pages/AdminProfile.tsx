import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "glamour_admin_profile";

const AdminProfile = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [message, setMessage] = useState(""); // For inline text notification
  const navigate = useNavigate();

  // Load saved profile
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setName(data.name || "");
      setImage(data.image || "/default-avatar.jfif");
    }
  }, []);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Save profile
  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, image }));
    setMessage("Profile saved successfully!");
    setTimeout(() => navigate("/admin/orders"), 1500); // Redirect after 1.5s
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Admin Profile</h1>

      {/* Profile Image */}
      <div className="space-y-2">
        <Label>Profile Image</Label>
        {image && (
          <img
            src={image}
            alt="Admin"
            className="w-8 h-8 rounded-full object-cover border"
          />
        )}
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {/* Name */}
      <div>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Profile
      </Button>

      {/* Inline text notification */}
      {message && (
        <p className="text-green-600 font-medium mt-2 text-center">{message}</p>
      )}
    </div>
  );
};

export default AdminProfile;

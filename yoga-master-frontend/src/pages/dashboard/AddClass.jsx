import React, { useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { UploadCloud, Loader } from 'lucide-react';

const AddClass = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // Video upload state
  
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    availableSeats: '',
    videoLink: '', // Yahan ab Cloudinary URL aayega
    description: '',
    instructorName: user?.name,
    instructorEmail: user?.email,
    status: 'pending',
    totalEnrolled: 0
  });

  // --- CLOUDINARY CONFIG ---
  const cloudName = "ddix4hkny"; // Apna Cloud Name yahan daalo
  const uploadPreset = "yoga_preset"; // Apna Preset Name yahan daalo (Unsigned wala)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- VIDEO UPLOAD FUNCTION ---
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    data.append("resource_type", "video"); // Zaruri hai video ke liye

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
            method: "POST",
            body: data
        });
        const urlData = await res.json();
        
        if(urlData.secure_url) {
            setFormData(prev => ({ ...prev, videoLink: urlData.secure_url }));
            toast.success("Video Uploaded Successfully!");
        } else {
            toast.error("Failed to get video URL.");
        }
    } catch (error) {
        console.error("Upload Error:", error);
        toast.error("Video upload failed.");
    } finally {
        setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.videoLink) {
        return toast.warning("Please upload a video first!");
    }

    setLoading(true);
    // Baki sab same rahega, kyunki backend bas URL expect karta hai
    const classData = {
        ...formData,
        price: parseFloat(formData.price),
        availableSeats: parseInt(formData.availableSeats)
    };

    try {
      const res = await api.post('/new-class', classData);
      if (res.data.insertedId) {
        toast.success("Class Added! Waiting for Approval.");
        // Reset Logic...
        setFormData({ ...formData, name: '', image: '', price: '', description: '', videoLink: '', availableSeats: '' });
      }
    } catch (error) {
      toast.error("Failed to add class.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Class</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Class Name</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" />
        </div>

        {/* Image */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Image URL (Poster)</label>
          <input type="text" name="image" required value={formData.image} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" />
        </div>

        {/* --- VIDEO UPLOAD INPUT --- */}
        <div>
            <label className="block text-gray-700 font-semibold mb-2">Upload Class Video</label>
            
            {uploading ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <Loader className="animate-spin" /> Uploading Video... Please wait.
                </div>
            ) : (
                <div className="flex gap-4">
                    <input 
                        type="file" 
                        accept="video/*" 
                        onChange={handleVideoUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                </div>
            )}
            
            {/* Show link if uploaded */}
            {formData.videoLink && !uploading && (
                <p className="text-xs text-green-600 mt-2">✓ Video attached successfully.</p>
            )}
        </div>

        {/* Price & Seats */}
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="block text-gray-700 font-semibold mb-2">Price ($)</label>
                <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" />
            </div>
            <div>
                <label className="block text-gray-700 font-semibold mb-2">Available Seats</label>
                <input type="number" name="availableSeats" required value={formData.availableSeats} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" />
            </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea name="description" rows="4" required value={formData.description} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg"></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading || uploading}
          className={`w-full py-3 rounded-lg font-bold text-white transition ${loading || uploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {loading ? 'Submitting...' : 'Add Class'}
        </button>
      </form>
    </div>
  );
};

export default AddClass;
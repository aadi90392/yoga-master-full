import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { Save, Loader } from 'lucide-react';

const UpdateClass = () => {
  const { id } = useParams(); // URL se ID nikalo
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    availableSeats: '',
    videoLink: '',
    description: '',
  });

  // 1. Purana Data Fetch Karo
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const res = await api.get(`/class/${id}`);
        const data = res.data[0]; // Backend array bhejta hai
        setFormData({
            name: data.name,
            image: data.image,
            price: data.price,
            availableSeats: data.availableSeats,
            videoLink: data.videoLink,
            description: data.description
        });
      } catch (error) {
        toast.error("Failed to load class data");
      } finally {
        setLoading(false);
      }
    };
    fetchClassData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Update Submit Karo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Backend: app.put('/update-class/:id')
      const res = await api.put(`/update-class/${id}`, formData);
      
      if (res.data.modifiedCount > 0) {
        toast.success("Class Updated! It is now Pending approval.");
        navigate('/dashboard/instructor-classes'); // Wapas list par bhejo
      } else {
        toast.info("No changes made.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update class.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-green-600">Loading details...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Update Class</h2>
      <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded mb-6 border border-yellow-100">
        Note: Updating class details will reset status to <b>Pending</b> for Admin approval.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Class Name</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div>
            <label className="block text-gray-700 font-semibold mb-2">Price ($)</label>
            <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
            <label className="block text-gray-700 font-semibold mb-2">Available Seats</label>
            <input type="number" name="availableSeats" required value={formData.availableSeats} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Video Link (Cloudinary)</label>
          <input type="text" name="videoLink" required value={formData.videoLink} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none" />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea name="description" rows="5" required value={formData.description} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"></textarea>
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
        >
          {submitting ? 'Updating...' : <><Save size={20} /> Save Changes</>}
        </button>
      </form>
    </div>
  );
};

export default UpdateClass;
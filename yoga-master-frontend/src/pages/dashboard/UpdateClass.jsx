import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { Save, Plus, Trash2, Loader, Video, ArrowLeft } from 'lucide-react';

const UpdateClass = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // --- STATE ---
    const [basicInfo, setBasicInfo] = useState({
        name: '', image: '', price: '', availableSeats: '', description: '',
        previewVideo: '' 
    });

    const [chapters, setChapters] = useState([]);

    // Cloudinary Config (Same as AddClass)
    const cloudName = "ddix4hkny"; 
    const uploadPreset = "yoga_preset"; 

    // 1. FETCH DATA
    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const res = await api.get(`/class/${id}`);
                const data = res.data[0];

                setBasicInfo({
                    name: data.name,
                    image: data.image,
                    price: data.price,
                    availableSeats: data.availableSeats,
                    description: data.description,
                    previewVideo: data.previewVideo || data.videoLink || '' // Handle legacy data
                });

                // Handle Chapters (Backward Compatibility)
                if (data.chapters && data.chapters.length > 0) {
                    setChapters(data.chapters);
                } else if (data.videoLink && !data.chapters) {
                    // Agar purani class hai jisme chapters nahi the, to main video ko Chapter 1 bana do
                    setChapters([{ 
                        title: 'Chapter 1: Full Class', 
                        description: 'Main course content.', 
                        video: data.videoLink, 
                        isFree: false 
                    }]);
                } else {
                    setChapters([{ title: '', description: '', video: '', isFree: true }]);
                }

            } catch (error) {
                toast.error("Failed to load class data");
            } finally {
                setLoading(false);
            }
        };
        fetchClassData();
    }, [id]);

    const handleBasicChange = (e) => {
        setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
    };

    // --- CHAPTER LOGIC ---
    const addChapter = () => {
        setChapters([...chapters, { title: '', description: '', video: '', videoFile: null, isFree: false }]);
    };

    const removeChapter = (index) => {
        const newChapters = chapters.filter((_, i) => i !== index);
        setChapters(newChapters);
    };

    const handleChapterChange = (index, field, value) => {
        const newChapters = [...chapters];
        newChapters[index][field] = value;
        setChapters(newChapters);
    };

    // --- UPLOAD HELPER ---
    const uploadToCloudinary = async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", uploadPreset);
        data.append("resource_type", "video");

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
            method: "POST", body: data
        });
        const urlData = await res.json();
        return urlData.secure_url;
    };

    // 2. SUBMIT UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // A. Update Preview Video (if new file selected)
            let finalPreviewUrl = basicInfo.previewVideo;
            const previewFile = document.getElementById('previewFile').files[0];
            if (previewFile) {
                toast.info("Uploading New Trailer...");
                finalPreviewUrl = await uploadToCloudinary(previewFile);
            }

            // B. Update Chapter Videos (if new files selected)
            const finalChapters = await Promise.all(chapters.map(async (chapter, index) => {
                let videoUrl = chapter.video; // Keep old URL by default
                
                if (chapter.videoFile) {
                    toast.info(`Uploading New Video for Chapter ${index + 1}...`);
                    videoUrl = await uploadToCloudinary(chapter.videoFile);
                }

                return {
                    title: chapter.title,
                    description: chapter.description,
                    video: videoUrl,
                    isFree: index === 0 // Force 1st chapter free logic if needed, or keep user preference
                };
            }));

            // C. Construct Payload
            const updateData = {
                ...basicInfo,
                price: parseFloat(basicInfo.price),
                availableSeats: parseInt(basicInfo.availableSeats),
                previewVideo: finalPreviewUrl,
                chapters: finalChapters
            };

            const res = await api.put(`/update-class/${id}`, updateData);
            
            if (res.data.modifiedCount > 0) {
                toast.success("Class Updated! Sent for Admin Approval.");
                navigate('/dashboard/instructor-classes');
            } else {
                toast.info("No changes detected.");
            }

        } catch (error) {
            console.error(error);
            toast.error("Update failed.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-20 font-bold text-green-600">Loading details...</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 my-8">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                    <ArrowLeft size={20}/>
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Update Course Content</h2>
            </div>

            <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded mb-8 border border-yellow-100 flex items-center gap-2">
                <Loader size={16} /> Note: Updating will reset class status to <b>Pending</b> for Admin review.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* --- BASIC INFO --- */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-green-600 border-b pb-2">1. Basic Details</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Class Name</label>
                            <input type="text" name="name" value={basicInfo.name} onChange={handleBasicChange} className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Thumbnail URL</label>
                            <input type="text" name="image" value={basicInfo.image} onChange={handleBasicChange} className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                        <textarea name="description" rows="3" value={basicInfo.description} onChange={handleBasicChange} className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white"></textarea>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Price ($)</label>
                            <input type="number" name="price" value={basicInfo.price} onChange={handleBasicChange} className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Total Seats</label>
                            <input type="number" name="availableSeats" value={basicInfo.availableSeats} onChange={handleBasicChange} className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white" />
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <label className="block text-sm font-bold text-blue-800 mb-2">Update Course Trailer</label>
                        {basicInfo.previewVideo && (
                            <div className="text-xs text-blue-600 mb-2 truncate">Current: {basicInfo.previewVideo}</div>
                        )}
                        <input type="file" id="previewFile" accept="video/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                </div>

                {/* --- CURRICULUM --- */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-green-600 border-b pb-2">2. Manage Curriculum</h3>
                    
                    {chapters.map((chapter, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group transition hover:border-gray-300 hover:shadow-sm">
                            <div className="absolute top-2 right-2">
                                <button type="button" onClick={() => removeChapter(index)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={18}/></button>
                            </div>
                            
                            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <Video size={16}/> Chapter {index + 1}
                            </h4>
                            
                            <div className="grid gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Chapter Title" 
                                    value={chapter.title} 
                                    onChange={(e) => handleChapterChange(index, 'title', e.target.value)} 
                                    className="w-full p-2 border rounded"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Description" 
                                    value={chapter.description} 
                                    onChange={(e) => handleChapterChange(index, 'description', e.target.value)} 
                                    className="w-full p-2 border rounded text-sm"
                                />
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1">
                                        Video Source {chapter.video ? '(File exists)' : '(No file)'}
                                    </label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="file" 
                                            accept="video/*"
                                            onChange={(e) => handleChapterChange(index, 'videoFile', e.target.files[0])}
                                            className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-white file:text-green-600"
                                        />
                                    </div>
                                    {/* Show existing URL if no new file picked */}
                                    {!chapter.videoFile && chapter.video && (
                                        <p className="text-[10px] text-gray-400 mt-1 truncate">Current Link: {chapter.video}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={addChapter} className="w-full border-2 border-dashed border-gray-300 text-gray-500 font-bold hover:bg-gray-50 hover:border-green-400 hover:text-green-600 px-4 py-3 rounded-lg transition flex items-center justify-center gap-2">
                        <Plus size={20} /> Add New Chapter
                    </button>
                </div>

                {/* --- FOOTER ACTIONS --- */}
                <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button 
                        type="button" 
                        onClick={() => navigate('/dashboard/instructor-classes')}
                        className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="flex-[2] bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition flex justify-center items-center gap-2"
                    >
                        {submitting ? <><Loader className="animate-spin"/> Updating...</> : <><Save size={20} /> Save Changes</>}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default UpdateClass;
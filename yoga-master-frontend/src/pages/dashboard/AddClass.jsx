import React, { useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { UploadCloud, Plus, Trash2, Loader, Video } from 'lucide-react';

const AddClass = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [loading, setLoading] = useState(false);
    
    // Basic Details
    const [basicInfo, setBasicInfo] = useState({
        name: '', image: '', price: '', availableSeats: '', description: '',
        previewVideo: '' // Main Trailer Video
    });

    // Chapters State
    const [chapters, setChapters] = useState([
        { title: '', description: '', videoUrl: '', videoFile: null, isFree: true } // 1st Chapter Free by default
    ]);

    // Cloudinary Config
    const cloudName = "ddix4hkny"; 
    const uploadPreset = "yoga_preset"; 

    const handleBasicChange = (e) => {
        setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
    };

    // --- CHAPTER HANDLING ---
    const addChapter = () => {
        setChapters([...chapters, { title: '', description: '', videoUrl: '', videoFile: null, isFree: false }]);
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

    // --- UPLOAD HELPER FUNCTION ---
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload Preview Video (Trailer)
            let previewUrl = basicInfo.previewVideo; // Agar URL dala hai
            const previewFile = document.getElementById('previewFile').files[0];
            
            if (previewFile) {
                toast.info("Uploading Preview Video...");
                previewUrl = await uploadToCloudinary(previewFile);
            }

            // 2. Upload All Chapter Videos
            const finalChapters = await Promise.all(chapters.map(async (chapter, index) => {
                let videoUrl = chapter.videoUrl;
                if (chapter.videoFile) {
                    toast.info(`Uploading Chapter ${index + 1} Video...`);
                    videoUrl = await uploadToCloudinary(chapter.videoFile);
                }
                return {
                    title: chapter.title,
                    description: chapter.description,
                    video: videoUrl,
                    isFree: index === 0 ? true : false // Logic: 1st is always free, others locked
                };
            }));

            // 3. Send to Backend
            const classData = {
                ...basicInfo,
                price: parseFloat(basicInfo.price),
                availableSeats: parseInt(basicInfo.availableSeats),
                previewVideo: previewUrl,
                chapters: finalChapters,
                instructorName: user?.name,
                instructorEmail: user?.email,
                status: 'pending',
                totalEnrolled: 0
            };

            const res = await api.post('/new-class', classData);
            if (res.data.insertedId) {
                toast.success("Class & Chapters Added Successfully!");
                // Reset Form logic here...
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to add class. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100 my-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Course</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* --- SECTION 1: BASIC INFO --- */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-green-600 border-b pb-2">1. Basic Information</h3>
                    <input type="text" name="name" placeholder="Class Title" required onChange={handleBasicChange} className="w-full p-3 border rounded-lg" />
                    <input type="text" name="image" placeholder="Cover Image URL" required onChange={handleBasicChange} className="w-full p-3 border rounded-lg" />
                    <textarea name="description" rows="3" placeholder="Course Description" required onChange={handleBasicChange} className="w-full p-3 border rounded-lg"></textarea>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <input type="number" name="price" placeholder="Price ($)" required onChange={handleBasicChange} className="w-full p-3 border rounded-lg" />
                        <input type="number" name="availableSeats" placeholder="Seats" required onChange={handleBasicChange} className="w-full p-3 border rounded-lg" />
                    </div>

                    {/* Preview Video Upload */}
                    <div>
                        <label className="block font-semibold mb-2 text-sm text-gray-600">Course Trailer (Free Preview for Everyone)</label>
                        <input type="file" id="previewFile" accept="video/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                    </div>
                </div>

                {/* --- SECTION 2: CHAPTERS (Curriculum) --- */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-green-600 border-b pb-2">2. Course Curriculum (Chapters)</h3>
                    
                    {chapters.map((chapter, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                            <div className="absolute top-2 right-2">
                                {chapters.length > 1 && (
                                    <button type="button" onClick={() => removeChapter(index)} className="text-red-500 hover:text-red-700"><Trash2 size={20}/></button>
                                )}
                            </div>
                            <h4 className="font-bold text-gray-700 mb-3">Chapter {index + 1} {index === 0 && <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded ml-2">FREE</span>}</h4>
                            
                            <div className="grid gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Chapter Title" 
                                    value={chapter.title} 
                                    onChange={(e) => handleChapterChange(index, 'title', e.target.value)} 
                                    className="w-full p-2 border rounded" required
                                />
                                <textarea 
                                    placeholder="Chapter Description" 
                                    value={chapter.description} 
                                    onChange={(e) => handleChapterChange(index, 'description', e.target.value)} 
                                    className="w-full p-2 border rounded" required
                                ></textarea>
                                
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Upload Chapter Video</label>
                                        <input 
                                            type="file" 
                                            accept="video/*"
                                            onChange={(e) => handleChapterChange(index, 'videoFile', e.target.files[0])}
                                            className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-white file:text-green-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={addChapter} className="flex items-center gap-2 text-green-700 font-bold hover:bg-green-50 px-4 py-2 rounded-lg transition">
                        <Plus size={20} /> Add New Chapter
                    </button>
                </div>

                {/* Submit */}
                <button disabled={loading} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-green-600 transition shadow-lg flex justify-center items-center gap-2">
                    {loading ? <><Loader className="animate-spin"/> Uploading & Saving...</> : "Submit Course for Approval"}
                </button>
            </form>
        </div>
    );
};

export default AddClass;
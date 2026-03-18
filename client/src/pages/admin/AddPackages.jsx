import React, { useState } from "react";
import { app } from "../../firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { FiUploadCloud, FiTrash2, FiPlusCircle, FiImage } from "react-icons/fi";

const AddPackages = () => {
  const [formData, setFormData] = useState({
    packageName: "", packageDescription: "", packageDestination: "",
    packageDays: 1, packageNights: 1, packageAccommodation: "",
    packageTransportation: "", packageMeals: "", packageActivities: "",
    packagePrice: 500, packageDiscountPrice: 0, packageOffer: false,
    packageImages: [],
  });
  const [images, setImages] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploadPercent, setImageUploadPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  };

  const handleImageSubmit = () => {
    if (images.length > 0 && images.length + formData.packageImages.length < 6) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({ ...formData, packageImages: formData.packageImages.concat(urls) });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2MB max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload up to 5 images per package");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name.replace(/\s/g, "");
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on("state_changed",
        (snapshot) => {
          setImageUploadPercent(Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve);
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({ ...formData, packageImages: formData.packageImages.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.packageImages.length === 0) return alert("You must upload at least 1 image");
    if (!formData.packageName || !formData.packageDescription || !formData.packageDestination || !formData.packageAccommodation || !formData.packageTransportation || !formData.packageMeals || !formData.packageActivities || formData.packagePrice === 0) {
      return alert("All fields are required!");
    }
    if (formData.packagePrice < 0) return alert("Price should be greater than 0!");
    if (formData.packageDiscountPrice >= formData.packagePrice) return alert("Regular Price should be greater than Discount Price!");
    
    if (formData.packageOffer === false) formData.packageDiscountPrice = 0;

    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/package/create-package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data?.success) { setError(data?.message); setLoading(false); return; }
      setLoading(false);
      alert(data?.message);
      setFormData({
        packageName: "", packageDescription: "", packageDestination: "",
        packageDays: 1, packageNights: 1, packageAccommodation: "",
        packageTransportation: "", packageMeals: "", packageActivities: "",
        packagePrice: 500, packageDiscountPrice: 0, packageOffer: false,
        packageImages: [],
      });
      setImages([]);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 w-fit">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          <FiPlusCircle size={22} />
        </div>
        <div>
          <p className="text-2xl font-extrabold text-slate-800">Add New Package</p>
          <p className="text-slate-400 text-sm">Create a new travel destination</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="w-full xl:w-2/3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Package Name</label>
                <input type="text" id="packageName" value={formData.packageName} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="E.g., Alpine Adventure" required />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Destination</label>
                <input type="text" id="packageDestination" value={formData.packageDestination} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="City, Country" required />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Description</label>
              <textarea id="packageDescription" value={formData.packageDescription} onChange={handleChange} rows="4" className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" placeholder="Describe the trip..." required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Days</label>
                <input type="number" min="1" id="packageDays" value={formData.packageDays} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" required />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Nights</label>
                <input type="number" min="0" id="packageNights" value={formData.packageNights} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" required />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Price ($)</label>
                <input type="number" min="0" id="packagePrice" value={formData.packagePrice} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" required />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Transport</label>
                <select id="packageTransportation" value={formData.packageTransportation} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  <option value="">Select</option>
                  <option>Flight</option><option>Train</option><option>Bus</option><option>Boat</option><option>Other</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <input type="checkbox" id="packageOffer" checked={formData.packageOffer} onChange={handleChange} className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
              <label htmlFor="packageOffer" className="text-sm font-bold text-indigo-900 cursor-pointer">Enable Special Offer/Discount</label>
            </div>
            
            {formData.packageOffer && (
              <div className="animate-fade-in">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Discount Price ($)</label>
                <input type="number" min="0" id="packageDiscountPrice" value={formData.packageDiscountPrice} onChange={handleChange} className="w-full md:w-1/2 px-4 py-2 border border-orange-200 rounded-xl bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Accommodation</label>
                <textarea id="packageAccommodation" value={formData.packageAccommodation} onChange={handleChange} rows="2" className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" placeholder="Hotel info..." />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Meals</label>
                <textarea id="packageMeals" value={formData.packageMeals} onChange={handleChange} rows="2" className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" placeholder="Breakfast, lunch..." />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Included Activities</label>
                <textarea id="packageActivities" value={formData.packageActivities} onChange={handleChange} rows="2" className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" placeholder="Sightseeing, trekking..." />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={uploading || loading} className="w-full py-3.5 mt-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-70">
              {loading ? "Creating Package..." : "Create Package"}
            </button>
          </form>
        </div>

        {/* Image Upload Sidebar */}
        <div className="w-full xl:w-1/3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4 h-fit sticky top-4">
          <div className="flex items-center gap-2 mb-2">
            <FiImage className="text-indigo-500" size={20} />
            <h3 className="font-bold text-slate-800">Package Images</h3>
          </div>
          <p className="text-xs text-slate-500">Upload up to 5 images. Maximum size is 2MB per image.</p>
          
          <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
            <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <FiUploadCloud size={32} className="text-slate-400 mb-2" />
            <span className="text-sm font-medium text-slate-600">Click to select images</span>
            {images.length > 0 && <span className="text-xs text-indigo-600 font-bold mt-2">{images.length} file(s) selected</span>}
          </div>
          
          {imageUploadError && <p className="text-red-500 text-xs">{imageUploadError}</p>}
          
          <button type="button" onClick={handleImageSubmit} disabled={uploading || loading || images.length === 0} className="w-full py-2.5 bg-indigo-100 text-indigo-700 rounded-xl font-bold hover:bg-indigo-200 transition-colors disabled:opacity-50">
            {uploading ? `Uploading ${imageUploadPercent}%` : "Upload Selected Images"}
          </button>

          {formData.packageImages.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase">Uploaded {formData.packageImages.length}/5</p>
              <div className="grid grid-cols-2 gap-3">
                {formData.packageImages.map((url, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200">
                    <img src={url} alt={`img-${i}`} className="w-full h-20 object-cover" />
                    <button type="button" onClick={() => handleDeleteImage(i)} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiTrash2 className="text-white" size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPackages;

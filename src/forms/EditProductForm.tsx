import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { ImagePlus, CheckCircle, AlertCircle, X } from "lucide-react";

type Category = { id: number; name: string };
type OptionType = { id: number; name: string };
type CreateProductData = { categories: Category[]; options: OptionType[] };
type ProductResponse = {
  id: number;
  name: string;
  price: number;
  description: string;
  categoryId: number;
  optionTypes: { id: number; name: string }[];
  imageUrl?: string;
  imageId?: number;
};

type EditProductFormProps = {
  productId: number;
  onClose: () => void;
  onUpdate: () => void;
};

const EditProductForm = ({
  productId,
  onClose,
  onUpdate,
}: EditProductFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [optionTypes, setOptionTypes] = useState<OptionType[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: 0,
    description: "",
    categoryId: 0,
    imageId: null as number | null,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await api.get<CreateProductData>(
          "/categories/options"
        );
        setCategories(response.data.categories || []);
        setOptionTypes(response.data.options || []);
      } catch (err) {
        console.error("Greška pri učitavanju kategorija i opcija:", err);
        setMessage("Greška pri učitavanju kategorija i opcija.");
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    console.log(productId);
    const fetchProduct = async () => {
      try {
        const response = await api.get<ProductResponse>(
          `/products/${productId}`
        );
        const data = response.data;
        setForm({
          name: data.name,
          price: data.price,
          description: data.description,
          categoryId: data.categoryId,
          imageId: data.imageId || null,
        });

        setSelectedOptions(data.optionTypes.map((opt) => opt.id));
         if (data.imageUrl) {
          const fullUrl = `${api.defaults.baseURL}${data.imageUrl}`;
          setImagePreview(fullUrl);
        }
      } catch (err) {
        console.error("Greška pri učitavanju proizvoda:", err);
        setMessage("Greška pri učitavanju proizvoda.");
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "categoryId" ? Number(value) : value,
    }));
  };

  const handleOptionToggle = (optId: number) => {
    setSelectedOptions((prev) =>
      prev.includes(optId) ? prev.filter((o) => o !== optId) : [...prev, optId]
    );
  };

  const handleFileChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, imageId: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        id: Number(productId),
        ...form,
        optionTypes: selectedOptions,
      };

      const formData = new FormData();
      formData.append("newProduct", JSON.stringify(updatedProduct));
      if (imageFile) formData.append("image", imageFile);

      const response = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(`Proizvod "${response.data.name}" uspešno ažuriran.`);
      onUpdate();
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      console.error("Greška pri ažuriranju proizvoda:", err);
      setMessage("Greška pri ažuriranju proizvoda.");
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-300 mt-10 text-lg">
        Učitavanje proizvoda...
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a2238] p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-blue-900/40 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl text-blue-400 font-bold text-center mb-8 tracking-wide">
          Izmeni proizvod
        </h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-gray-400">Naziv proizvoda</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 mt-2 rounded-lg bg-[#232b45] text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Cena (RSD)</label>
            <input
              type="number"
              name="price"
              value={form.price || ""}
              onChange={handleChange}
              className="w-full p-3 mt-2 rounded-lg bg-[#232b45] text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Opis proizvoda</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 mt-2 rounded-lg bg-[#232b45] text-gray-100 resize-none h-24 focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Kategorija</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full p-3 mt-2 rounded-lg bg-[#232b45] text-gray-200 cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Odaberi kategoriju</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Opcioni tipovi</label>
            <div className="flex flex-wrap gap-2 mt-3">
              {optionTypes.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition-all ${
                    selectedOptions.includes(opt.id)
                      ? "bg-blue-600 border-blue-500 text-white shadow-md"
                      : "bg-[#232b45] border-gray-600 hover:border-blue-400 text-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(opt.id)}
                    onChange={() => handleOptionToggle(opt.id)}
                    className="accent-blue-500"
                  />
                  {opt.name}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm text-gray-400 mb-2 block">
              Slika proizvoda
            </label>
            <label className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg cursor-pointer transition">
              <ImagePlus size={18} />
              Izaberi novu sliku
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>

            {imagePreview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded-lg w-36 h-36 object-cover border border-gray-600 shadow-md"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 py-3 rounded-xl font-semibold text-white shadow-lg transition"
            >
              Sačuvaj izmene
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-xl font-semibold text-white transition"
            >
              Odustani
            </button>
          </div>

          {message && (
            <div className="text-center mt-4 flex items-center justify-center gap-2 text-sm">
              {message.includes("uspešno") ? (
                <CheckCircle className="text-green-400" size={18} />
              ) : (
                <AlertCircle className="text-red-400" size={18} />
              )}
              <span
                className={
                  message.includes("uspešno")
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {message}
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;

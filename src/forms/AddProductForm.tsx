import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { ImagePlus, CheckCircle, AlertCircle } from "lucide-react";

type Category = { id: number; name: string };
type OptionType = { id: number; name: string };
type CreateProductData = { categories: Category[]; options: OptionType[] };
type NewProduct = {
  name: string;
  price: number;
  description: string;
  categoryId: number;
  optionTypes: number[];
};

const AddProductForm = () => {
  const [form, setForm] = useState<NewProduct>({
    name: "",
    price: 0,
    description: "",
    categoryId: 0,
    optionTypes: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [optionTypes, setOptionTypes] = useState<OptionType[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await api.get<CreateProductData>("/categories/options");
        setCategories(response.data.categories || []);
        setOptionTypes(response.data.options || []);
      } catch (err) {
        console.error("Greška pri učitavanju kategorija i opcija:", err);
        setMessage("Greška pri učitavanju kategorija i opcija.");
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

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

  const handleOptionToggle = (id: number) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((opt) => opt !== id) : [...prev, id]
    );
  };

  const handleFileChange = (file: File | null) => {
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
    else setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProduct = { ...form, optionTypes: selectedOptions };
      const formData = new FormData();
      formData.append("newProduct", JSON.stringify(newProduct));
      if (imageFile) formData.append("image", imageFile);

      const response = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(`Proizvod "${response.data.name}" uspešno dodat.`);
      setForm({ name: "", price: 0, description: "", categoryId: 0, optionTypes: [] });
      setSelectedOptions([]);
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Greška pri dodavanju proizvoda:", err);
      setMessage("Greška pri dodavanju proizvoda. Proveri backend log.");
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-300 mt-10 text-lg">Učitavanje podataka...</div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1625] py-12 px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a2238] p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-blue-900/40 transition-all"
      >
        <h2 className="text-3xl text-blue-400 font-bold text-center mb-8 tracking-wide">
          Dodaj novi proizvod
        </h2>

        {/* Naziv proizvoda */}
        <div>
          <label className="text-sm text-gray-400">Naziv proizvoda</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Unesi naziv proizvoda"
            className="w-full p-3 mt-2 rounded-lg bg-[#232b45] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        {/* Cena */}
        <div>
          <label className="text-sm text-gray-400">Cena (RSD)</label>
          <input
            type="number"
            name="price"
            value={form.price || ""}
            onChange={handleChange}
            placeholder="Unesi cenu"
            className="w-full p-3 mt-2 rounded-lg bg-[#232b45] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        {/* Opis */}
        <div>
          <label className="text-sm text-gray-400">Opis proizvoda</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Kratak opis proizvoda"
            className="w-full p-3 mt-2 rounded-lg bg-[#232b45] text-gray-100 resize-none h-24 focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
          />
        </div>

        {/* Kategorija */}
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

        {/* Opcioni tipovi */}
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

        {/* Slika */}
        <div className="mt-4">
          <label className="text-sm text-gray-400 mb-2 block">Slika proizvoda</label>
          <label className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center cursor-pointer transition">
            <ImagePlus size={18} />
            Dodaj sliku
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

        {/* Submit dugme */}
        <button
          type="submit"
          className="mt-6 w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 py-3 rounded-xl font-semibold text-white shadow-lg transition"
        >
          Sačuvaj proizvod
        </button>

        {/* Poruka */}
        {message && (
          <div className="text-center mt-4 flex items-center justify-center gap-2 text-sm">
            {message.includes("uspešno") ? (
              <CheckCircle className="text-green-400" size={18} />
            ) : (
              <AlertCircle className="text-red-400" size={18} />
            )}
            <span
              className={
                message.includes("uspešno") ? "text-green-400" : "text-red-400"
              }
            >
              {message}
            </span>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddProductForm;

import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

type Category = {
  id: number;
  name: string;
};

type OptionType = {
  id: number;
  name: string;
};

type CreateProductData = {
  categories: Category[];
  options: OptionType[];
};

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
        setMessage("⚠️ Greška pri učitavanju kategorija i opcija.");
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
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
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

      setMessage(` Proizvod "${response.data.name}" uspešno dodat.`);

      setForm({
        name: "",
        price: 0,
        description: "",
        categoryId: 0,
        optionTypes: [],
      });
      setSelectedOptions([]);
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Greška pri dodavanju proizvoda:", err);
      setMessage("Greška pri dodavanju proizvoda. Proveri backend log.");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-300 mt-8">
        <p>Učitavanje podataka...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1f2a40] text-gray-200 p-6 rounded-xl max-w-lg mx-auto mt-10 shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <h2 className="text-2xl text-blue-400 text-center font-semibold">
          Dodaj novi proizvod
        </h2>

        <div>
          <label className="text-sm text-gray-400">Naziv proizvoda</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Unesi naziv proizvoda"
            className="w-full p-2 rounded bg-[#2a2a3d] mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
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
            placeholder="Unesi cenu"
            className="w-full p-2 rounded bg-[#2a2a3d] mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
    
        <div>
          <label className="text-sm text-gray-400">Opis</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Unesi opis proizvoda"
            className="w-full p-2 rounded bg-[#2a2a3d] mt-1 resize-none h-20 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

      
        <div>
          <label className="text-sm text-gray-400">Kategorija</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#2a2a3d] mt-1 cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
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
          <div className="flex flex-wrap gap-2 mt-2">
            {optionTypes.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg border cursor-pointer transition ${
                  selectedOptions.includes(opt.id)
                    ? "bg-blue-600 border-blue-500"
                    : "bg-[#2a2a3d] border-gray-600 hover:border-blue-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(opt.id)}
                  onChange={() => handleOptionToggle(opt.id)}
                  className="accent-blue-500"
                />
                <span>{opt.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Slika proizvoda</label>
          <label className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center cursor-pointer transition w-full">
            📤 Upload sliku
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 rounded-lg w-32 h-32 object-cover border border-gray-600"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium mt-4 transition"
        >
          ✅ Sačuvaj proizvod
        </button>

        {message && (
          <p className="text-center text-blue-400 mt-2 text-sm">{message}</p>
        )}
      </form>
    </div>
  );
};

export default AddProductForm;

import api from "../api/axiosConfig";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  categoryId: number;
  categoryName: string;
  imageId?: number | null;
};

type Props = {
  product: Product;
  onCustomize: () => void;
};

const ProductCard = ({ product, onCustomize }: Props) => {
  const imageUrl = product.imageId
    ? `${api.defaults.baseURL}/images/${product.imageId}`
    : "/fallback.jpg";

  return (
    <div className="flex flex-col bg-[#1e1e2f] text-gray-100 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden">
      <div className="relative w-full h-[380px]">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e2f]/80 via-transparent to-transparent" />
      </div>
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-blue-400 mb-2">
            {product.name}
          </h2>
          <p className="text-gray-300 mb-4 line-clamp-2">{product.description}</p>
          <p className="text-blue-300 font-bold text-lg">
            {product.price.toFixed(2)} RSD
          </p>
        </div>

        <button
          onClick={onCustomize}
          className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Prilagodi model
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

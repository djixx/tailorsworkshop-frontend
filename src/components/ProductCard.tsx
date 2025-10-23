type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  categoryId: number;
  categoryName: string;
};

type Props = {
  product: Product;
  onCustomize: () => void;
};

const ProductCard = ({ product, onCustomize }: Props) => {
  return (
    <div className="flex flex-col justify-between h-full bg-[#1e1e2f] text-gray-100 border border-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <div>
        <h2 className="text-xl font-semibold text-blue-400 mb-2">
          {product.name}
        </h2>
        <p className="text-gray-300 mb-2">{product.description}</p>
        <p className="text-blue-300 font-semibold">
          {product.price.toFixed(2)} RSD
        </p>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={onCustomize}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Prilagodi model
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

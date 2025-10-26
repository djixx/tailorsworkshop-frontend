const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111827] text-white">
      <div className="p-8 rounded-lg bg-[#1f2937] shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-400">Uplata uspešna!</h1>
        <p className="text-gray-300 mb-6">
          Vaša porudžbina je poslata na odobrenje. Hvala na poverenju!
        </p>
        <a
          href="/"
          className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 text-white"
        >
          Nazad na početnu
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;

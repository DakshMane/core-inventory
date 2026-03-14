import Input from '../../../components/ui/Input'

export default function DeliveryLineItem({ line, index, products = [], onChange, onRemove }) {

  // Find the selected product object to read its available stock
  const selectedProduct = products.find(
    (p) => p.name === line.productName || p.sku === line.productName
  )
  const available = selectedProduct?.totalStock ?? null

  function handleProduct(e) {
    onChange(index, { ...line, productName: e.target.value })
  }

  function handle(e) {
    onChange(index, { ...line, [e.target.name]: e.target.value })
  }

  return (
    <div className="grid grid-cols-12 gap-3 items-end py-3 border-b border-gray-100 last:border-0">

      {/* Product dropdown */}
      <div className="col-span-5">
        {index === 0 && (
          <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
        )}
        <select
          value={line.productName}
          onChange={handleProduct}
          required
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none bg-white
            focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
        >
          <option value="">— Select product —</option>
          {products.map((p) => (
            <option key={p._id || p.id} value={p.name}>
              {p.name} {p.sku ? `(${p.sku})` : ''}
            </option>
          ))}
        </select>

        {/* Available stock badge */}
        {selectedProduct && (
          <p className={`text-xs mt-1 font-medium ${available > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {available > 0
              ? `✓ ${available} units available`
              : '✗ No stock available'}
          </p>
        )}
      </div>

      {/* Demand Qty */}
      <div className="col-span-3">
        <Input
          label={index === 0 ? 'Demand Qty' : ''}
          type="number"
          name="demandQty"
          value={line.demandQty}
          onChange={handle}
          min={1}
          max={available ?? undefined}
          required
        />
        {available !== null && line.demandQty > available && (
          <p className="text-xs text-red-500 mt-1">Exceeds available stock</p>
        )}
      </div>

      {/* Done Qty */}
      <div className="col-span-3">
        <Input label={index === 0 ? 'Done Qty' : ''} type="number" name="doneQty" value={line.doneQty} onChange={handle} min={0} />
      </div>

      {/* Remove */}
      <div className="col-span-1 flex justify-end">
        <button onClick={() => onRemove(index)} className="text-red-400 hover:text-red-600 text-lg pb-1">✕</button>
      </div>

    </div>
  )
}
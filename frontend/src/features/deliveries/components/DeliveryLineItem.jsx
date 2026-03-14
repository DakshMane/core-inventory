import Input from '../../../components/ui/Input'

export default function DeliveryLineItem({ line, index, onChange, onRemove }) {
  function handle(e) {
    onChange(index, { ...line, [e.target.name]: e.target.value })
  }

  return (
    <div className="grid grid-cols-12 gap-3 items-end py-3 border-b border-gray-100 last:border-0">
      <div className="col-span-5">
        <Input label={index === 0 ? 'Product' : ''} name="productName" value={line.productName} onChange={handle} placeholder="Product name or SKU" required />
      </div>
      <div className="col-span-3">
        <Input label={index === 0 ? 'Demand Qty' : ''} type="number" name="demandQty" value={line.demandQty} onChange={handle} min={1} required />
      </div>
      <div className="col-span-3">
        <Input label={index === 0 ? 'Done Qty' : ''} type="number" name="doneQty" value={line.doneQty} onChange={handle} min={0} />
      </div>
      <div className="col-span-1 flex justify-end">
        <button onClick={() => onRemove(index)} className="text-red-400 hover:text-red-600 text-lg pb-1">✕</button>
      </div>
    </div>
  )
}
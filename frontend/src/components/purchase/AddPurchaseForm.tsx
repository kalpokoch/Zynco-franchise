import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  gst: number;
  priceWithTax: number;
  amount: number;
}

interface PurchaseFormData {
  invoiceNumber: string;
  supplierName: string;
  billingDate: Date;
  billingAddress: string;
  products: ProductItem[];
  total: {
    quantity: number;
    amount: number;
  };
}

interface AddPurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (purchaseData: PurchaseFormData) => void;
}

const generateInvoiceNumber = (): string => {
  return `#${Math.floor(100 + Math.random() * 900)}`;
};

const calculatePriceWithTax = (price: number, gst: number): number => {
  return price + (price * gst) / 100;
};

const calculateAmount = (quantity: number, priceWithTax: number): number => {
  return quantity * priceWithTax;
};

const AddPurchaseForm: React.FC<AddPurchaseFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [purchaseData, setPurchaseData] = useState<PurchaseFormData>({
    invoiceNumber: generateInvoiceNumber(),
    supplierName: '',
    billingDate: new Date(),
    billingAddress: '',
    products: [
      {
        id: '1',
        name: 'Rice',
        quantity: 1,
        unit: 'Kg',
        pricePerUnit: 22,
        gst: 5,
        priceWithTax: 23.1,
        amount: 23.1,
      },
      {
        id: '2',
        name: 'Rice',
        quantity: 5,
        unit: 'Kg',
        pricePerUnit: 22,
        gst: 5,
        priceWithTax: 23.1,
        amount: 115.5,
      },
    ],
    total: {
      quantity: 6,
      amount: 138.6,
    },
  });

  const updateTotals = (products: ProductItem[]): { quantity: number; amount: number } => {
    const totals = products.reduce(
      (acc, product) => {
        return {
          quantity: acc.quantity + product.quantity,
          amount: acc.amount + product.amount,
        };
      },
      { quantity: 0, amount: 0 }
    );
    
    // Round off the total amount to the nearest integer
    totals.amount = Math.round(totals.amount);
    
    return totals;
  };

  const handleSupplierNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPurchaseData({ ...purchaseData, supplierName: e.target.value });
  };

  const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPurchaseData({ ...purchaseData, billingAddress: e.target.value });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setPurchaseData({ ...purchaseData, billingDate: date });
    }
  };

  const handleProductNameChange = (id: string, value: string) => {
    const updatedProducts = purchaseData.products.map(product => 
      product.id === id ? { ...product, name: value } : product
    );
    setPurchaseData({ ...purchaseData, products: updatedProducts });
  };

  const handleQuantityChange = (id: string, value: string) => {
    const quantity = parseInt(value) || 0;
    const updatedProducts = purchaseData.products.map(product => {
      if (product.id === id) {
        const amount = calculateAmount(quantity, product.priceWithTax);
        return { ...product, quantity, amount };
      }
      return product;
    });
    
    setPurchaseData({
      ...purchaseData,
      products: updatedProducts,
      total: updateTotals(updatedProducts),
    });
  };

  const handleUnitChange = (id: string, value: string) => {
    const updatedProducts = purchaseData.products.map(product => 
      product.id === id ? { ...product, unit: value } : product
    );
    setPurchaseData({ ...purchaseData, products: updatedProducts });
  };

  const handlePricePerUnitChange = (id: string, value: string) => {
    const price = parseFloat(value) || 0;
    const updatedProducts = purchaseData.products.map(product => {
      if (product.id === id) {
        const priceWithTax = calculatePriceWithTax(price, product.gst);
        const amount = calculateAmount(product.quantity, priceWithTax);
        return { ...product, pricePerUnit: price, priceWithTax, amount };
      }
      return product;
    });
    
    setPurchaseData({
      ...purchaseData,
      products: updatedProducts,
      total: updateTotals(updatedProducts),
    });
  };

  const handleGstChange = (id: string, value: string) => {
    const gst = parseFloat(value) || 0;
    const updatedProducts = purchaseData.products.map(product => {
      if (product.id === id) {
        const priceWithTax = calculatePriceWithTax(product.pricePerUnit, gst);
        const amount = calculateAmount(product.quantity, priceWithTax);
        return { ...product, gst, priceWithTax, amount };
      }
      return product;
    });
    
    setPurchaseData({
      ...purchaseData,
      products: updatedProducts,
      total: updateTotals(updatedProducts),
    });
  };

  const addNewProduct = () => {
    const newProduct: ProductItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unit: 'Kg',
      pricePerUnit: 0,
      gst: 5,
      priceWithTax: 0,
      amount: 0,
    };
    
    const updatedProducts = [...purchaseData.products, newProduct];
    
    setPurchaseData({
      ...purchaseData,
      products: updatedProducts,
      total: updateTotals(updatedProducts),
    });
  };

  const removeProduct = (id: string) => {
    if (purchaseData.products.length <= 1) return;
    
    const updatedProducts = purchaseData.products.filter(product => product.id !== id);
    
    setPurchaseData({
      ...purchaseData,
      products: updatedProducts,
      total: updateTotals(updatedProducts),
    });
  };

  const handleSubmit = () => {
    onSubmit(purchaseData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add new Purchase</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Invoice number: {purchaseData.invoiceNumber}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="supplierName" className="block mb-2">
                Supplier Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="supplierName"
                placeholder="Enter Supplier Name"
                value={purchaseData.supplierName}
                onChange={handleSupplierNameChange}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="billingDate" className="block mb-2">
                Billing Date<span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !purchaseData.billingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {purchaseData.billingDate ? format(purchaseData.billingDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={purchaseData.billingDate}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="billingAddress" className="block mb-2">
              Billing Address
            </Label>
            <Input
              id="billingAddress"
              placeholder="Enter Billing Address"
              value={purchaseData.billingAddress}
              onChange={handleBillingAddressChange}
              className="w-full"
            />
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium">
              <div className="col-span-3">Product Name</div>
              <div className="col-span-1">Quantity</div>
              <div className="col-span-1">Unit</div>
              <div className="col-span-2">Price/Unit</div>
              <div className="col-span-1">GST%</div>
              <div className="col-span-2">Price with Tax</div>
              <div className="col-span-2">Amount</div>
            </div>
            
            {purchaseData.products.map((product, index) => (
              <div key={product.id} className="grid grid-cols-12 gap-2 mb-3 items-center">
                <div className="col-span-3">
                  <Input
                    value={product.name}
                    onChange={(e) => handleProductNameChange(product.id, e.target.value)}
                    placeholder="Product name"
                    className="h-9 w-full"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="h-9 w-full"
                  />
                </div>
                <div className="col-span-1">
                  <Select
                    value={product.unit}
                    onValueChange={(value) => handleUnitChange(product.id, value)}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kg">Kg</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="Pcs">Pcs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
                    <Input
                      type="number"
                      min="0"
                      className="pl-8 h-9 w-full"
                      value={product.pricePerUnit}
                      onChange={(e) => handlePricePerUnitChange(product.id, e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <Select
                    value={product.gst.toString()}
                    onValueChange={(value) => handleGstChange(product.id, value)}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="GST %" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="12">12%</SelectItem>
                      <SelectItem value="18">18%</SelectItem>
                      <SelectItem value="28">28%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
                    <Input
                      type="number"
                      min="0"
                      className="pl-8 h-9 w-full"
                      value={product.priceWithTax.toFixed(2)}
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-span-2 flex items-center">
                  <div className="relative flex-grow mr-2">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
                    <Input
                      type="number"
                      min="0"
                      className="pl-8 h-9 w-full"
                      value={product.amount.toFixed(2)}
                      readOnly
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProduct(product.id)}
                    disabled={purchaseData.products.length <= 1}
                    className="flex-shrink-0"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addNewProduct}
              className="mt-2"
            >
              <Plus size={16} className="mr-2" /> Add Product
            </Button>
          </div>
          
          <div className="flex justify-between items-center mt-6 font-medium">
            <div>Total:</div>
            <div className="flex gap-8">
              <div>{purchaseData.total.quantity}</div>
              <div>₹{Math.round(purchaseData.total.amount)}</div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between mt-6">
          <div>
            <Button variant="outline" className="mr-2">
              Print
            </Button>
          </div>
          <div>
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 text-white">
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPurchaseForm;

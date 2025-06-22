import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';  // Updated import
import ActionButton from '@/components/dashboard/ActionButton';
import { Plus, Search, CircleChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PaymentOut: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Dummy data for demonstration
  const payments = [
    { id: 1, invoice: 'INV-1005', supplierName: 'XYZ Agro Ltd.', paymentDate: '2025-12-12', totalAmount: 30000, status: 'Paid' },
    { id: 2, invoice: 'INV-1004', supplierName: 'ABC Traders', paymentDate: '2025-12-09', totalAmount: 18500, status: 'Pending' },
    { id: 3, invoice: 'INV-1003', supplierName: 'Fresh Mart sup...', paymentDate: '2025-11-22', totalAmount: 22000, status: 'Paid' },
    { id: 4, invoice: 'INV-1002', supplierName: 'Northeast C.', paymentDate: '2025-11-12', totalAmount: 45000, status: 'Unpaid' },
    { id: 5, invoice: 'INV-1001', supplierName: 'Universal p.', paymentDate: '2025-11-11', totalAmount: 30000, status: 'Paid' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">Payment Out History</h1>

        <div className="flex gap-2 mt-4 md:mt-0">
          <ActionButton
            icon={<ShoppingBag size={18} />}
            label="Add Payment"
            onClick={() => {}}
            className="bg-blue-600 hover:bg-purple-700 text-white"
          />
          <ActionButton
            icon={<Plus size={18} />}
            label="Add Purchase"
            onClick={() => navigate('history')}
            className="bg-[#6366F1] hover:bg-[#6366F1]/90"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input
              type="text"
              placeholder="Search payments"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">View details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.invoice}</TableCell>
                  <TableCell>{payment.supplierName}</TableCell>
                  <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                  <TableCell>₹{payment.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'Paid' ? 'bg-green-100 text-green-800' :
                      payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      className="text-gray-500 hover:text-blue-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                      onClick={() => {}}
                    >
                      <CircleChevronRight size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="text-sm text-gray-500 mr-2">Showing</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={itemsPerPage.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500 ml-2">
              of {payments.length}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((pageNumber) => (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0 rounded-md"
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentOut;

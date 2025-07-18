import { User } from '@/types';

interface PrintableReceiptProps {
  border: User;
  onClose: () => void;
}

export const PrintableReceipt = ({ border, onClose }: PrintableReceiptProps) => {
  const handlePrint = () => {
    window.print();
  };

  const totalFines = border.fines?.reduce((sum, fine) => sum + fine.amount, 0) || 0;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-inter font-semibold text-lg text-gray-900">Print Preview</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div id="receiptContent" className="font-mono border-2 border-dashed border-gray-400 p-4 bg-white">
            <div className="text-center mb-4">
              <h2 className="font-bold text-xl">MESS MONITOR</h2>
              <p className="text-sm">Hostel Management System</p>
              <div className="border-b-2 border-dashed border-gray-400 my-2"></div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-bold mb-2">BORDER PROFILE SUMMARY</h3>
              <p>Name: {border.name}</p>
              <p>Phone: {border.phone}</p>
              <p>Department: {border.department}</p>
              <p>Duty: {border.duty}</p>
            </div>
            
            <div className="border-b-2 border-dashed border-gray-400 my-2"></div>
            
            <div className="mb-4">
              <h4 className="font-bold mb-1">FINANCIAL STATUS</h4>
              <p>Owes To: {border.owesTo || 'None'}</p>
              <p>Gets From: {border.getsFrom || 'None'}</p>
              <p>Monthly: ৳ {border.monthlyContribution?.toLocaleString() || 'Not set'}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-bold mb-1">FINES</h4>
              {border.fines && border.fines.length > 0 ? (
                <>
                  {border.fines.map((fine, index) => (
                    <p key={index}>- {fine.reason}: ৳ {fine.amount}</p>
                  ))}
                  <p className="font-bold">Total Fines: ৳ {totalFines}</p>
                </>
              ) : (
                <p>No fines recorded</p>
              )}
            </div>
            
            <div className="border-b-2 border-dashed border-gray-400 my-2"></div>
            
            <div className="text-center text-sm">
              <p>Verified by Mess Monitor</p>
              <p>Print Date: {new Date().toLocaleString()}</p>
              <p className="mt-2">Signature: ___________________</p>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handlePrint}
              className="flex-1 bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

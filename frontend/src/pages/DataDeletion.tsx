import React from 'react';

const DataDeletion: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Data Deletion Request</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">How to request deletion of your data</h2>
          <p className="mb-4">
            In compliance with Facebook Platform policies, we provide this tool for you to request deletion of your data from our systems.
          </p>
          
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <h3 className="font-semibold mb-2">Method 1: Direct Request</h3>
            <p>Send an email to <strong>datadeletion@f1chatter.com</strong> with the following information:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Subject line: "Data Deletion Request"</li>
              <li>Your full name</li>
              <li>Email address associated with your account</li>
              <li>Facebook User ID (if you know it)</li>
            </ul>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Method 2: Form Submission</h3>
            <p className="mb-4">Complete the form below to request deletion of your data:</p>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Your email address"
                />
              </div>
              
              <div>
                <label htmlFor="facebook_id" className="block mb-1 font-medium">Facebook User ID (optional)</label>
                <input 
                  type="text" 
                  id="facebook_id" 
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Your Facebook ID if known"
                />
              </div>
              
              <div>
                <label htmlFor="details" className="block mb-1 font-medium">Additional Details</label>
                <textarea 
                  id="details" 
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={3}
                  placeholder="Any additional information"
                ></textarea>
              </div>
              
              <div>
                <button 
                  type="submit" 
                  className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition-colors"
                >
                  Submit Deletion Request
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">What happens next</h2>
          <p className="mb-2">
            Once we receive your request, we will:
          </p>
          <ol className="list-decimal pl-6">
            <li>Verify your identity as the account owner</li>
            <li>Delete all your personal data from our systems within 30 days</li>
            <li>Send a confirmation email when the process is complete</li>
          </ol>
        </div>
        
        <div className="text-sm text-gray-600 border-t pt-4">
          <p>
            This data deletion mechanism is provided in compliance with Facebook's Platform Terms. You can also 
            revoke permissions to our app through your Facebook settings at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataDeletion; 
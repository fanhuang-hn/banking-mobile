'use client';

export default function FirebaseSetupGuide() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Hướng dẫn cấu hình Firebase</h2>
      
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Cần cấu hình Firebase</h3>
          <p className="text-yellow-700">
            Để ứng dụng hoạt động, bạn cần tạo project Firebase và cấu hình environment variables.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">1. Tạo Firebase Project</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Truy cập <a href="https://console.firebase.google.com/" target="_blank" className="underline">Firebase Console</a></li>
            <li>Tạo project mới</li>
            <li>Kích hoạt Authentication → Sign-in method → Email/Password</li>
            <li>Tạo Firestore Database (chế độ test)</li>
            <li>Vào Project Settings → General → Your apps → Web app</li>
            <li>Sao chép Firebase config</li>
          </ol>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">2. Cấu hình Environment Variables</h3>
          <p className="text-green-800 mb-4">Cập nhật file <code className="bg-green-100 px-2 py-1 rounded">.env.local</code>:</p>
          <pre className="bg-green-100 p-4 rounded-lg text-sm overflow-x-auto">
{`NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id`}
          </pre>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">3. Firestore Security Rules</h3>
          <p className="text-purple-800 mb-4">Thêm rules sau vào Firestore:</p>
          <pre className="bg-purple-100 p-4 rounded-lg text-sm overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own transactions
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.user_id;
    }
  }
}`}
          </pre>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">4. Demo Account</h3>
          <p className="text-gray-700 mb-2">Sau khi cấu hình xong, sử dụng thông tin sau để đăng nhập:</p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p><strong>Email:</strong> demo.user@ewallet.com</p>
            <p><strong>Password:</strong> demo123456</p>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Hoặc sử dụng nút "Tạo & sử dụng tài khoản demo" trên trang đăng nhập.
          </p>
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          <form>
            <div className="mb-4">
              <label className="block mb-2">Email</label>
              <input type="email" className="border w-full p-2 rounded" />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Password</label>
              <input type="password" className="border w-full p-2 rounded" />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
          </form>
        </div>
      </div>
    );
  }
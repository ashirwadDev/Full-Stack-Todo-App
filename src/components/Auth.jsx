import { supabase } from "../supabaseClient";

export default function Auth() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://todo-app5510.netlify.app", // Change for deployed app
      },
    });
    if (error) console.error(error.message);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="mb-6 text-2xl font-bold">Login</h2>
      <button
        onClick={handleGoogleLogin}
        className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </div>
  );
}

import Image from "next/image";
import { signInWithGoogle, signInWithGithub } from "./actions";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-md ">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-sky-blue-600">Kira</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Analyze your resume with AI
          </p>
        </div>

        <form action={signInWithGoogle}>
          <button className="w-full flex items-center justify-center gap-3 rounded-lg p-3 hover:bg-gray-50 transition mb-3 text-gray-700 cursor-pointer border hover:border-gray-700">
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </button>
        </form>

        <form action={signInWithGithub}>
          <button className="w-full flex items-center justify-center gap-3 rounded-lg p-3 hover:bg-gray-50 transition mb-3 text-gray-700 cursor-pointer border hover:border-gray-700">
            <Image src="/github.svg" alt="Google" width={20} height={20} />
            Continue with GitHub
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

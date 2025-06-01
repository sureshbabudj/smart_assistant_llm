import axios from "axios";
import { Logo } from "./Logo";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "./Modal";

export function Login({ loadRegister }: { loadRegister: () => void }) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle login logic here
    try {
      const email = (e.target as HTMLFormElement).email.value;
      const password = (e.target as HTMLFormElement).password.value;
      console.log("Logging in with:", { email, password });

      const response = await axios.post("/api/users/login", {
        email,
        password,
      });
      if (response.status === 200) {
        // Assuming the response contains a JWT token
        const { token } = response.data;
        localStorage.setItem("jwt", token);
        window.location.reload(); // Reload to simulate login success
      } else {
        console.error("Login failed:", response.data);
        // Handle login failure (e.g., show an error message)
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // If the error is an Axios error, you can access the response
        if (error.response) {
          console.error("Response data:", error.response.data);
          alert(`Error: ${error.response.data.error || "Unknown error"}`);
        } else {
          console.error("Error message:", error.message);
          alert(`Error: ${error.message}`);
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Modal>
        <ModalHeader>
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4 flex items-center flex-row gap-2">
              <Logo /> <span>Welcome to SmartAI</span>
            </h1>
            <p className="mb-6 text-sm font-thin">Please log in to continue</p>
          </div>
        </ModalHeader>
        <ModalContent>
          {/* Login Form */}
          <div className="space-y-4 my-2 mb-4">
            <div className="form-group">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your Email"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your Password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <p className="text-center text-foreground">
            By logging in, you agree to our{" "}
            <a href="/terms" className="text-blue-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-500">
              Privacy Policy
            </a>
            .
          </p>
          <div className="flex justify-center">
            <button
              type="submit"
              className="btn btn-primary w-full mt-4 bg-highlight text-background hover:bg-highlight/90 focus:outline-none focus:ring-2 focus:ring-highlight/50 focus:ring-offset-2 rounded-2xl p-2 px-4 text-sm font-semibold shadow-sm transition-colors duration-200 ease-in-out"
            >
              Login
            </button>
          </div>
          <p className="text-sm text-center">
            <a
              type="button"
              className="btn btn-link text-foreground cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                loadRegister();
              }}
            >
              No Account! Register Here
            </a>
          </p>
        </ModalFooter>
      </Modal>
    </form>
  );
}

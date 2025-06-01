import axios from "axios";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "./Modal";

export function Profile({ hide }: { hide: () => void }) {
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `/api/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      if (response.status === 200) {
        localStorage.removeItem("jwt");
        window.location.reload();
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // If the error is an Axios error, you can access the response
        if (error.response) {
          console.error("Response data:", error.response.data);
          alert(`Error: ${error.response.data.message || "Unknown error"}`);
        } else {
          console.error("Error message:", error.message);
          alert(`Error: ${error.message}`);
        }
      }
    }
  };

  // get profile information from localStorage.jwt
  const jwt = localStorage.getItem("jwt") || "";
  const {
    email = "",
    name = "",
    userId = "",
  } = JSON.parse(atob(jwt.split(".")[1]));

  return (
    <Modal>
      <ModalHeader>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold mb-4 flex items-center flex-row gap-2">
            <span>My Profile</span>
          </h1>
        </div>
      </ModalHeader>
      <ModalContent>
        <div className="space-y-4 my-2 mb-4">
          {/* // Profile Information */}
          {userId && (
            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold">User ID</div>
              <div className="text-sm text-gray-600">{userId}</div>
            </div>
          )}
          {name && (
            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold">Name</div>
              <div className="text-sm text-gray-600">{name}</div>
            </div>
          )}
          {email && (
            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold">Email</div>
              <div className="text-sm text-gray-600">{email}</div>
            </div>
          )}
        </div>
      </ModalContent>
      <ModalFooter>
        <div className="flex justify-center flex-col items-center w-full">
          <button
            type="button"
            className="btn btn-primary w-full mt-4 bg-highlight text-background hover:bg-highlight/90 focus:outline-none focus:ring-2 focus:ring-highlight/50 focus:ring-offset-2 rounded-2xl p-2 px-4 text-sm font-semibold shadow-sm transition-colors duration-200 ease-in-out"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            type="button"
            className="btn w-full mt-4 focus:outline-none focus:ring-2 focus:ring-highlight/50 focus:ring-offset-2 rounded-2xl p-2 px-4 text-sm font-semibold shadow-sm transition-colors duration-200 ease-in-out"
            onClick={hide}
          >
            Close
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

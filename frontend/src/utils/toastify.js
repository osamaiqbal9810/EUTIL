import { toast } from "react-toastify";

class Toast {
  Info = (message) => {
    toast.info(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  Error = (message, error) => {
    toast.error(message + "\n" + error, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  ServerError = (error) => {
    toast.error(error.statusCode + "\n" + error.message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  Success = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  Warning = (message) => {
    toast.warn(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
}

export const ToastService = new Toast();
